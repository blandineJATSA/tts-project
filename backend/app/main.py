from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import database
from app.models.tts_job import TTSJobCreate, TTSJob
from app.database import tts_jobs_collection

app = FastAPI(title="TTS Project API")

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
    job = TTSJob(
        user_id=job_data.user_id,
        text=job_data.text,
        voice_id=job_data.voice_id,
    )
    result = await tts_jobs_collection.insert_one(job.model_dump())
    return {"job_id": str(result.inserted_id), "status": job.status}