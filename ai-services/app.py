from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import logging
from config import settings

# Import routers
from routers import chat, sentiment, rag

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Smart Hospitality AI Services",
    description="AI-powered services for hotel management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
app.include_router(sentiment.router)
app.include_router(rag.router)

# Health check endpoint
@app.get("/health")
async def health():
    """AI Services health check"""
    return {
        "status": "ok",
        "service": "ai-services",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    """AI Services API"""
    return {
        "message": "Smart Hospitality AI Services",
        "docs": "/docs",
        "health": "/health"
    }

# Startup event
@app.on_event("startup")
async def startup():
    logger.info("AI Services starting up...")
    logger.info(f"Groq API configured: {bool(settings.GROQ_API_KEY)}")
    logger.info(f"Gemini API configured: {bool(settings.GEMINI_API_KEY)}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown():
    logger.info("AI Services shutting down...")

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return {
        "detail": "Internal server error",
        "type": type(exc).__name__
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )