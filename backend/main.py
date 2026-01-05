from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str


def mock_ai_reply(text: str) -> str:
    t = text.lower()
    
    if "hello" in t:
        return "Hello! Welcome back"
    if "help" in t:
        return "How can i help you?"
    if "bye" in t:
        return "Bye"
    return f"{text}"


@app.post("/api/chat")
def chat(req: ChatRequest):
    return {
        "reply": mock_ai_reply(req.message),
        "timestamp": datetime.utcnow().isoformat()
    }
