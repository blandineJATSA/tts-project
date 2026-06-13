import os
import uuid
from gtts import gTTS

# Dossier temporaire pour stocker les fichiers audio générés
# avant leur upload vers S3
AUDIO_TEMP_DIR = "temp_audio"
os.makedirs(AUDIO_TEMP_DIR, exist_ok=True)


def generate_audio(text: str, voice_id: str) -> str:
    """
    Génère un fichier audio à partir d'un texte.

    TEMPORAIRE : utilise gTTS pour construire le pipeline.
    Sera remplacé par Kokoro v0.19 dans une étape dédiée.

    Retourne le chemin du fichier audio généré localement.
    """
    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(AUDIO_TEMP_DIR, filename)

    tts = gTTS(text=text, lang='fr')
    tts.save(filepath)

    return filepath