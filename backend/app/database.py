import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME")

client = AsyncIOMotorClient(MONGODB_URL)
database = client[MONGODB_DB_NAME]

# Collections
tts_jobs_collection = database["tts_jobs"]
users_collection = database["users"]
voices_collection = database["voices"]