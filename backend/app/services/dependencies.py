from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import verify_jwt_token
from app.database import users_collection
from bson import ObjectId

# Schéma de sécurité Bearer Token
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Le 'videur' du document - vérifie le JWT avant chaque route protégée.

    Comment ça fonctionne :
    1. Extrait le token du header Authorization: Bearer <token>
    2. Vérifie la signature et l'expiration du JWT
    3. Récupère l'utilisateur depuis MongoDB
    4. Retourne l'utilisateur ou lève une erreur 401
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou expiré.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 1. Vérifier le JWT
    token = credentials.credentials
    payload = verify_jwt_token(token)

    if payload is None:
        raise credentials_exception

    # 2. Extraire l'user_id du payload
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    # 3. Récupérer l'utilisateur depuis MongoDB
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception

    # 4. Retourner l'utilisateur (sans le mot de passe)
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "credits": user.get("credits", 1000)
    }