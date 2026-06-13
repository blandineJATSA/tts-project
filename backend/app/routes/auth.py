from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserLogin, UserResponse
from app.services.auth_service import hash_password, verify_password, create_jwt_token
from app.database import users_collection
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Inscription - équivalent du POST /signup du document
    1. Vérifie que l'email n'existe pas déjà
    2. Hash le mot de passe
    3. Crée l'utilisateur en base
    4. Renvoie un message de succès (sans le mot de passe)
    """

    # 1. Vérifier que l'email n'est pas déjà utilisé (code 409 = conflit)
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cet email est déjà utilisé."
        )

    # 2. Hash le mot de passe - jamais en clair !
    hashed = hash_password(user_data.password)

    # 3. Créer le document utilisateur
    from app.models.user import UserInDB
    new_user = UserInDB(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed,
    )

    result = await users_collection.insert_one(new_user.model_dump())

    # 4. Répondre sans renvoyer le mot de passe
    return {"message": "Compte créé avec succès.", "user_id": str(result.inserted_id)}


@router.post("/login")
async def login(user_data: UserLogin):
    """
    Connexion - équivalent du POST /login du document
    1. Cherche l'utilisateur par email
    2. Vérifie le mot de passe avec bcrypt
    3. Génère un JWT
    4. Renvoie le token + infos utilisateur
    """

    # 1. Chercher l'utilisateur par email
    user = await users_collection.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect."
        )

    # 2. Vérifier le mot de passe avec bcrypt
    if not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect."
        )

    # 3. Générer le JWT - le "badge numérique"
    token = create_jwt_token(
        user_id=str(user["_id"]),
        email=user["email"]
    )

    # 4. Renvoyer le token + infos utilisateur (sans mot de passe)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "credits": user.get("credits", 1000)
        }
    }


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Route protégée - retourne l'utilisateur connecté
    Sans JWT valide → 401 automatique
    """
    return current_user