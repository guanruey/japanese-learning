from fastapi import FastAPI
from app.models.schema import Base
from sqlalchemy import create_engine
from app.api.ws_audio import router as ws_audio_router

app = FastAPI(title="Trilingual AI Language Learning App")

# Using sqlite for initial development
engine = create_engine("sqlite:///./test.db")
Base.metadata.create_all(bind=engine)

app.include_router(ws_audio_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Trilingual AI Language Learning App API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
