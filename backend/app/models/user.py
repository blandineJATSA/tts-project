from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone


class UserCreate(BaseModel):
    """Données reçues du frontend pour créer un compte"""
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Données reçues du frontend pour se connecter"""
    email: EmailStr
    password: str


class UserInDB(BaseModel):
    """Document complet stocké dans MongoDB"""
    name: str
    email: str
    hashed_password: str
    credits: int = 1000
    created_at: datetime = None
    updated_at: datetime = None

    def __init__(self, **data):
        if 'created_at' not in data or data['created_at'] is None:
            data['created_at'] = datetime.now(timezone.utc)
        if 'updated_at' not in data or data['updated_at'] is None:
            data['updated_at'] = datetime.now(timezone.utc)
        super().__init__(**data)


class UserResponse(BaseModel):
    """Ce qu'on renvoie au frontend - jamais le mot de passe !"""
    id: str
    name: str
    email: str
    credits: int