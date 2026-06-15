from fastapi import APIRouter, Depends
from app.services.dependencies import get_current_user
from app.database import tts_jobs_collection, users_collection, events_collection
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    """Bloc 1 — Usage Analytics"""

    # Total jobs
    total_jobs = await tts_jobs_collection.count_documents({})
    completed_jobs = await tts_jobs_collection.count_documents({"status": "completed"})
    failed_jobs = await tts_jobs_collection.count_documents({"status": "failed"})
    pending_jobs = await tts_jobs_collection.count_documents({"status": "pending"})

    # Taux de succès
    success_rate = round((completed_jobs / total_jobs * 100), 1) if total_jobs > 0 else 0

    # Total caractères générés
    pipeline_chars = [
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": {"$strLenCP": "$text"}}}}
    ]
    chars_result = await tts_jobs_collection.aggregate(pipeline_chars).to_list(1)
    total_chars = chars_result[0]["total"] if chars_result else 0

    # Total utilisateurs
    total_users = await users_collection.count_documents({})

    # Crédits consommés (total)
    pipeline_credits = [
        {"$group": {"_id": None, "total": {"$sum": "$credits"}}},
    ]
    credits_result = await users_collection.aggregate([
        {"$group": {"_id": None, "remaining": {"$sum": "$credits"}}}
    ]).to_list(1)
    credits_remaining = credits_result[0]["remaining"] if credits_result else 0
    credits_consumed = (total_users * 1000) - credits_remaining

    return {
        "total_jobs": total_jobs,
        "completed_jobs": completed_jobs,
        "failed_jobs": failed_jobs,
        "pending_jobs": pending_jobs,
        "success_rate": success_rate,
        "total_chars": total_chars,
        "total_users": total_users,
        "credits_consumed": credits_consumed,
    }


@router.get("/pipeline")
async def get_pipeline(current_user: dict = Depends(get_current_user)):
    """Bloc 2 — Pipeline Monitor"""

    # Jobs par statut
    statuses = ["pending", "completed", "failed"]
    pipeline_data = []
    for status in statuses:
        count = await tts_jobs_collection.count_documents({"status": status})
        pipeline_data.append({"status": status, "count": count})

    # Derniers jobs (10 plus récents)
    cursor = tts_jobs_collection.find({}).sort("created_at", -1).limit(10)
    recent_jobs = []
    async for job in cursor:
        recent_jobs.append({
            "id": str(job["_id"]),
            "status": job.get("status"),
            "text_preview": job.get("text", "")[:50] + "..." if len(job.get("text", "")) > 50 else job.get("text", ""),
            "voice_id": job.get("voice_id"),
            "created_at": job.get("created_at").isoformat() if job.get("created_at") else None,
            "error_message": job.get("error_message"),
        })

    # Dernières erreurs
    cursor_errors = tts_jobs_collection.find({"status": "failed"}).sort("created_at", -1).limit(5)
    recent_errors = []
    async for job in cursor_errors:
        recent_errors.append({
            "id": str(job["_id"]),
            "error": job.get("error_message", "Erreur inconnue"),
            "created_at": job.get("created_at").isoformat() if job.get("created_at") else None,
        })

    return {
        "pipeline_data": pipeline_data,
        "recent_jobs": recent_jobs,
        "recent_errors": recent_errors,
    }


@router.get("/quality")
async def get_quality(current_user: dict = Depends(get_current_user)):
    """Bloc 3 — Data Quality"""

    # Jobs sans audio_url mais completed
    missing_audio = await tts_jobs_collection.count_documents({
        "status": "completed",
        "audio_url": None
    })

    # Jobs échoués
    failed_jobs = await tts_jobs_collection.count_documents({"status": "failed"})

    # Jobs avec texte vide
    empty_text = await tts_jobs_collection.count_documents({
        "$or": [{"text": ""}, {"text": None}]
    })

    # Doublons (même texte + même voix)
    pipeline_duplicates = [
        {"$group": {
            "_id": {"text": "$text", "voice_id": "$voice_id"},
            "count": {"$sum": 1}
        }},
        {"$match": {"count": {"$gt": 1}}},
        {"$count": "total"}
    ]
    dup_result = await tts_jobs_collection.aggregate(pipeline_duplicates).to_list(1)
    duplicates = dup_result[0]["total"] if dup_result else 0

    # Score de qualité global
    total = await tts_jobs_collection.count_documents({})
    issues = missing_audio + empty_text + duplicates
    quality_score = round(((total - issues) / total * 100), 1) if total > 0 else 100

    return {
        "missing_audio": missing_audio,
        "failed_jobs": failed_jobs,
        "empty_text": empty_text,
        "duplicates": duplicates,
        "quality_score": quality_score,
        "total_jobs": total,
    }


@router.get("/events")
async def get_events(current_user: dict = Depends(get_current_user)):
    """Bloc 4 — Event Tracking"""

    # 50 derniers événements
    cursor = events_collection.find({}).sort("created_at", -1).limit(50)
    events = []
    async for event in cursor:
        events.append({
            "id": str(event["_id"]),
            "type": event.get("type"),
            "user_id": event.get("user_id"),
            "metadata": event.get("metadata", {}),
            "created_at": event.get("created_at").isoformat() if event.get("created_at") else None,
        })

    # Comptage par type d'événement
    pipeline_counts = [
        {"$group": {"_id": "$type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    type_counts = await events_collection.aggregate(pipeline_counts).to_list(20)
    event_types = [{"type": e["_id"], "count": e["count"]} for e in type_counts]

    return {
        "events": events,
        "event_types": event_types,
        "total_events": len(events),
    }