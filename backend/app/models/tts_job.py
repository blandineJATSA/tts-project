from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from datetime import datetime, timezone


class JobStatus(str, Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"


class TTSJobCreate(BaseModel):
    """Données reçues du frontend pour créer un job"""
    text: str
    voice_id: str
    user_id: str


class TTSJob(BaseModel):
    """Document complet stocké dans MongoDB"""
    user_id: str
    text: str
    voice_id: str
    status: JobStatus = JobStatus.pending
    audio_url: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))