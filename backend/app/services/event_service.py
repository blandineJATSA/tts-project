from datetime import datetime, timezone
from app.database import events_collection


async def track_event(event_type: str, user_id: str, metadata: dict = {}):
    """
    Enregistre un événement dans MongoDB.
    Appelé à chaque action importante dans l'app.
    """
    event = {
        "type": event_type,
        "user_id": user_id,
        "metadata": metadata,
        "created_at": datetime.now(timezone.utc)
    }
    await events_collection.insert_one(event)