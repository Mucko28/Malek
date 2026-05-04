from fastapi import FastAPI, APIRouter, HTTPException, Header
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import hmac
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import jwt
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# ============================================================
# Auth + Flavours (admin-editable hero flavour list)
# ============================================================
ADMIN_USER = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")
JWT_SECRET = os.environ.get("JWT_SECRET", secrets.token_hex(32))
JWT_ALG = "HS256"
JWT_TTL_DAYS = 7


def _create_token(sub: str) -> str:
    payload = {
        "sub": sub,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_TTL_DAYS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def _verify_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    sub = payload.get("sub")
    if sub != ADMIN_USER:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return sub


class LoginBody(BaseModel):
    username: str
    password: str


class Flavour(BaseModel):
    name: str = Field(..., min_length=1, max_length=60)
    color: str = Field(..., min_length=3, max_length=20)


class FlavoursBody(BaseModel):
    items: List[Flavour] = Field(default_factory=list, max_length=10)


DEFAULT_FLAVOURS: List[dict] = [
    {"name": "Vanilková", "color": "#F4E4C5"},
    {"name": "Smetanová", "color": "#F1E8D4"},
    {"name": "Belgická čokoláda", "color": "#5A3A2A"},
    {"name": "Jahodová", "color": "#D87A82"},
    {"name": "Stracciatella", "color": "#E8DEC9"},
    {"name": "Pistáciová", "color": "#A8C795"},
    {"name": "Citrónová tříšť", "color": "#F0DC73"},
    {"name": "Malinová tříšť", "color": "#C4536A"},
]


@api_router.post("/auth/login")
async def auth_login(body: LoginBody):
    ok_user = hmac.compare_digest(body.username, ADMIN_USER)
    ok_pass = hmac.compare_digest(body.password, ADMIN_PASSWORD)
    if not (ok_user and ok_pass):
        raise HTTPException(status_code=401, detail="Nesprávné přihlašovací údaje")
    token = _create_token(ADMIN_USER)
    return {"token": token, "user": ADMIN_USER}


@api_router.get("/auth/verify")
async def auth_verify(authorization: Optional[str] = Header(default=None)):
    _verify_token(authorization)
    return {"ok": True, "user": ADMIN_USER}


@api_router.get("/flavours")
async def get_flavours():
    doc = await db.flavours.find_one({"key": "today"}, {"_id": 0})
    if not doc:
        return {"items": DEFAULT_FLAVOURS}
    return {"items": doc.get("items", DEFAULT_FLAVOURS)}


@api_router.put("/flavours")
async def set_flavours(
    body: FlavoursBody,
    authorization: Optional[str] = Header(default=None),
):
    _verify_token(authorization)
    items = [f.model_dump() for f in body.items][:10]
    await db.flavours.update_one(
        {"key": "today"},
        {
            "$set": {
                "key": "today",
                "items": items,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
        upsert=True,
    )
    return {"ok": True, "count": len(items), "items": items}

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/frames/info")
async def frames_info():
    """Returns metadata about the pre-extracted hero video frame sequence."""
    frames_dir = ROOT_DIR / "static" / "frames"
    if not frames_dir.exists():
        return {"count": 0, "fps": 24, "duration": 0}
    files = sorted(frames_dir.glob("frame_*.jpg"))
    return {
        "count": len(files),
        "fps": 24,
        "duration": len(files) / 24.0,
        "pattern": "/api/frames/frame_{:03d}.jpg",
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

# Mount static frames so they are reachable via /api/frames/<filename>.jpg
# (the /api prefix is required by Kubernetes ingress to reach the backend)
frames_path = ROOT_DIR / "static" / "frames"
if frames_path.exists():
    app.mount("/api/frames", StaticFiles(directory=str(frames_path)), name="frames")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()