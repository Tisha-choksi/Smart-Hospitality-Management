from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import logging
import uvicorn

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Smart Hospitality AI Services",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Smart Hospitality AI Services",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai-services",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/ai/chat")
async def chat(message: str):
    return {
        "response": f"You said: {message}. How can I help?",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/ai/sentiment/analyze")
async def sentiment(text: str):
    positive = any(word in text.lower() for word in ['love', 'great', 'amazing', 'good'])
    negative = any(word in text.lower() for word in ['hate', 'bad', 'terrible', 'awful'])
    
    if positive:
        sentiment_type = "POSITIVE"
    elif negative:
        sentiment_type = "NEGATIVE"
    else:
        sentiment_type = "NEUTRAL"
    
    return {
        "sentiment": sentiment_type,
        "confidence": 0.85,
        "text": text
    }

@app.post("/ai/rag/query")
async def rag_query(query: str, top_k: int = 3):
    return {
        "answer": "Welcome to Smart Hospitality. How can I assist you?",
        "sources": ["hotel_info"],
        "confidence": 0.9
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True)