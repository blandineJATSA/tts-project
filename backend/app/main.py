import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from bson import ObjectId

from app.database import database, tts_jobs_collection, users_collection
from app.models.tts_job import TTSJobCreate, TTSJob
from app.services.tts_service import generate_audio
from app.services.storage_service import upload_to_s3
from app.services.dependencies import get_current_user
from app.routes.auth import router as auth_router
from app.routes.jobs import router as jobs_router
from app.routes.analytics import router as analytics_router
from app.services.event_service import track_event

app = FastAPI(title="TTS Project API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(analytics_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/db-check")
async def db_check():
    collections = await database.list_collection_names()
    return {"status": "connected", "collections": collections}


@app.post("/api/tts/jobs")
async def create_job(
    job_data: TTSJobCreate,
    current_user: dict = Depends(get_current_user)
):
    # 1. Calculer le coût en crédits
    credits_cost = len(job_data.text)

    # 2. Vérifier que l'user a assez de crédits
    user = await users_collection.find_one({"_id": ObjectId(current_user["id"])})
    current_credits = user.get("credits", 0)

    if current_credits < credits_cost:
        return {
            "status": "error",
            "message": f"Crédits insuffisants. Coût : {credits_cost}, solde : {current_credits}"
        }

    # 3. Créer le job avec status "pending"
    job = TTSJob(
        user_id=current_user["id"],
        text=job_data.text,
        voice_id=job_data.voice_id,
    )
    result = await tts_jobs_collection.insert_one(job.model_dump())
    job_id = result.inserted_id

    try:
        # 4. Générer l'audio
        audio_path = generate_audio(job_data.text, job_data.voice_id)

        # 5. Uploader sur S3
        audio_url = upload_to_s3(audio_path)

        await track_event("audio_generated", current_user["id"], {
            "voice_id": job_data.voice_id,
            "chars": len(job_data.text),
            "credits_used": credits_cost
            })

        # 6. Supprimer le fichier local
        os.remove(audio_path)

        # 7. Mettre à jour le job : succès
        await tts_jobs_collection.update_one(
            {"_id": job_id},
            {"$set": {
                "status": "completed",
                "audio_url": audio_url,
                "updated_at": datetime.now(timezone.utc)
            }}
        )

        # 8. Déduire les crédits de l'utilisateur
        new_credits = current_credits - credits_cost
        await users_collection.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": {
                "credits": new_credits,
                "updated_at": datetime.now(timezone.utc)
            }}
        )

        return {
            "job_id": str(job_id),
            "status": "completed",
            "audio_url": audio_url,
            "credits_used": credits_cost,
            "credits_remaining": new_credits
        }

    except Exception as e:
        await tts_jobs_collection.update_one(
            {"_id": job_id},
            {"$set": {
                "status": "failed",
                "error_message": str(e),
                "updated_at": datetime.now(timezone.utc)
            }}
        )
        return {"job_id": str(job_id), "status": "failed", "error": str(e)}