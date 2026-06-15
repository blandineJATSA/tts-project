import os
import uuid
import soundfile as sf
from kokoro import KPipeline
import numpy as np

AUDIO_TEMP_DIR = "temp_audio"
os.makedirs(AUDIO_TEMP_DIR, exist_ok=True)

# Pipeline Kokoro - chargé une seule fois au démarrage du serveur
# 'a' = anglais américain (voix disponibles les plus stables pour Kokoro v0.19)
# pipeline = KPipeline(lang_code='a')
pipeline = KPipeline(lang_code='fr-fr')

VOICE_MAPPING = {
    "voice_001": "ff_siwis",    # voix féminine française
    "voice_002": "ff_siwis",    # pas d'autre voix masculine FR dispo pour l'instant
    "voice_003": "ff_siwis",
    "voice_004": "ff_siwis",
    "voice_005": "ff_siwis",
    "voice_006": "ff_siwis",
}

# Correspondance entre nos voix mockées et les voix Kokoro réelles
""" 
VOICE_MAPPING = {
    "voice_001": "af_heart",    # Sophie -> voix féminine US
    "voice_002": "am_adam",     # Thomas -> voix masculine US
    "voice_003": "af_bella",    # Camille -> voix féminine US
    "voice_004": "am_michael",  # Lucas -> voix masculine US
    "voice_005": "af_sarah",    # Emma -> voix féminine US
    "voice_006": "am_adam",     # Nathan -> voix masculine US
}

"""

def generate_audio(text: str, voice_id: str) -> str:
    """
    Génère un fichier audio à partir d'un texte avec Kokoro v0.19.
    """
    kokoro_voice = VOICE_MAPPING.get(voice_id, "ff_siwis")

    filename = f"{uuid.uuid4()}.wav"
    filepath = os.path.join(AUDIO_TEMP_DIR, filename)

    generator = pipeline(text, voice=kokoro_voice)

    # Kokoro génère par chunks - on concatène tous les segments audio
    audio_segments = []
    for _, _, audio in generator:
        audio_segments.append(audio)

    
    full_audio = np.concatenate(audio_segments)

    sf.write(filepath, full_audio, 24000)  # 24kHz = fréquence native de Kokoro

    return filepath