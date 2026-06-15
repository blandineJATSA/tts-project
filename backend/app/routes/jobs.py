from fastapi import APIRouter, Depends
from app.services.dependencies import get_current_user
from app.database import tts_jobs_collection
from bson import ObjectId

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


def serialize_job(job) -> dict:
    """Convertit un document MongoDB en dict JSON-serializable"""
    return {
        "id": str(job["_id"]),
        "text": job.get("text", ""),
        "voice_id": job.get("voice_id", ""),
        "status": job.get("status", ""),
        "audio_url": job.get("audio_url", None),
        "error_message": job.get("error_message", None),
        "created_at": job.get("created_at", "").isoformat() if job.get("created_at") else None,
    }


@router.get("")
async def get_jobs(current_user: dict = Depends(get_current_user)):
    """
    Retourne tous les jobs de l'utilisateur connecté
    Trié du plus récent au plus ancien
    Protégé par JWT via get_current_user
    """
    cursor = tts_jobs_collection.find(
        {"user_id": current_user["id"]}
    ).sort("created_at", -1).limit(50)

    jobs = []
    async for job in cursor:
        jobs.append(serialize_job(job))

    return {"jobs": jobs, "total": len(jobs)}