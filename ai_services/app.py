from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
from groq import Groq
import logging
import uvicorn
import os
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address, default_limits=["30/minute"])
app = FastAPI(
    title="Smart Hospitality AI Services",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "https://shmi.vercel.app,http://localhost:3000"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https://.*\\.vercel\\.app$",
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

def get_groq_client():
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        return None
    try:
        return Groq(api_key=api_key)
    except Exception as e:
        logger.error(f"Failed to initialize Groq client: {e}")
        return None

@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "ai-service",
        "message": "AI API is running",
        "endpoints": [
            "/health",
            "/ai/chat",
            "/ai/sentiment/analyze",
            "/ai/rag/query",
            "/docs"
        ]
    }


@app.head("/")
async def root_head():
    return Response(status_code=200)

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai-services",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/ai/chat")
@limiter.limit("10/minute")
async def chat(request: Request, message: str):
    """Chat with real Groq AI"""
    try:
        groq_client = get_groq_client()
        if not groq_client:
            return {
                "response": "AI service is not configured yet. Missing GROQ_API_KEY.",
                "timestamp": datetime.now().isoformat(),
                "error": "missing_groq_api_key"
            }

        completion = groq_client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful hotel concierge assistant. Help guests with room service, amenities, bookings, and local recommendations. Be friendly and professional. Keep responses concise (under 100 words)."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.7,
            max_tokens=500,
        )
        
        return {
            "response": completion.choices[0].message.content,
            "timestamp": datetime.now().isoformat(),
            "model": "mixtral-8x7b-32768"
        }
    
    except Exception as e:
        logger.error(f"Groq error: {e}")
        return {
            "response": "I apologize, but I'm having trouble processing your request. Please try again.",
            "timestamp": datetime.now().isoformat(),
            "error": "internal_error"
        }

@app.post("/ai/sentiment/analyze")
@limiter.limit("10/minute")
async def sentiment(request: Request, text: str):
    """Analyze sentiment using Groq"""
    try:
        groq_client = get_groq_client()
        if not groq_client:
            return {
                "sentiment": "NEUTRAL",
                "confidence": 0.5,
                "text": text,
                "error": "missing_groq_api_key"
            }

        completion = groq_client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {
                    "role": "system",
                    "content": "Analyze the sentiment of the given text. Response MUST be in this exact JSON format: {\"sentiment\": \"POSITIVE\"|\"NEGATIVE\"|\"NEUTRAL\", \"confidence\": 0.0-1.0}"
                },
                {
                    "role": "user",
                    "content": f"Analyze this text: {text}"
                }
            ],
            temperature=0.3,
            max_tokens=100,
        )
        
        import json
        response_text = completion.choices[0].message.content
        
        try:
            result = json.loads(response_text)
            return {
                "sentiment": result.get("sentiment", "NEUTRAL"),
                "confidence": result.get("confidence", 0.7),
                "text": text
            }
        except Exception:
            # Fallback if JSON parsing fails
            if "positive" in response_text.lower():
                sentiment_type = "POSITIVE"
            elif "negative" in response_text.lower():
                sentiment_type = "NEGATIVE"
            else:
                sentiment_type = "NEUTRAL"
            
            return {
                "sentiment": sentiment_type,
                "confidence": 0.8,
                "text": text
            }
    
    except Exception as e:
        logger.error(f"Sentiment error: {e}")
        return {
            "sentiment": "NEUTRAL",
            "confidence": 0.5,
            "text": text,
            "error": "internal_error"
        }

@app.post("/ai/rag/query")
@limiter.limit("10/minute")
async def rag_query(request: Request, query: str, top_k: int = 3):
    """Query with Groq"""
    top_k = max(1, min(10, top_k))
    try:
        groq_client = get_groq_client()
        if not groq_client:
            return {
                "answer": "AI service is not configured yet. Missing GROQ_API_KEY.",
                "sources": [],
                "error": "missing_groq_api_key"
            }

        knowledge = """
        Hotel Hours: Breakfast 6:30am-10:30am, Lunch 12pm-2:30pm, Dinner 6pm-10pm
        Check-in: 3pm, Check-out: 11am
        Amenities: Pool, Fitness center 24/7, Restaurant, Bar, Business center
        Free Wi-Fi in all rooms
        Pet policy: $50/night fee
        Parking: Free for all guests
        """
        
        completion = groq_client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {
                    "role": "system",
                    "content": f"You are a hotel information assistant. Use this knowledge base to answer questions:\n{knowledge}"
                },
                {
                    "role": "user",
                    "content": query
                }
            ],
            temperature=0.5,
            max_tokens=300,
        )
        
        return {
            "answer": completion.choices[0].message.content,
            "sources": ["hotel_database"],
            "confidence": 0.9
        }
    
    except Exception as e:
        logger.error(f"RAG error: {e}")
        return {
            "answer": "I couldn't find information about that. Please contact the front desk.",
            "sources": [],
            "error": "internal_error"
        }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True)
