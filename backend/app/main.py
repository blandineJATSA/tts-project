from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import database
from app.models.tts_job import TTSJobCreate, TTSJob
from app.database import tts_jobs_collection
from app.services.tts_service import generate_audio
from bson import ObjectId
from datetime import datetime, timezone
from app.services.storage_service import upload_to_s3
from app.routes.auth import router as auth_router
import os

app = FastAPI(title="TTS Project API")
app.include_router(auth_router)

# Autorise le frontend (localhost:3000) à appeler ce backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/db-check")
async def db_check():
    collections = await database.list_collection_names()
    return {"status": "connected", "collections": collections}

@app.post("/api/tts/jobs")
async def create_job(job_data: TTSJobCreate):
    # 1. Créer le job avec status "pending"
    job = TTSJob(
        user_id=job_data.user_id,
        text=job_data.text,
        voice_id=job_data.voice_id,
    )
    result = await tts_jobs_collection.insert_one(job.model_dump())
    job_id = result.inserted_id

    try:
        # 2. Générer l'audio localement
        audio_path = generate_audio(job_data.text, job_data.voice_id)

        # 3. Uploader sur S3
        audio_url = upload_to_s3(audio_path)

        # 4. Supprimer le fichier local temporaire
        os.remove(audio_path)

        # 5. Mettre à jour le job : succès
        await tts_jobs_collection.update_one(
            {"_id": job_id},
            {"$set": {
                "status": "completed",
                "audio_url": audio_url,
                "updated_at": datetime.now(timezone.utc)
            }}
        )
        return {"job_id": str(job_id), "status": "completed", "audio_url": audio_url}

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