from fastapi import APIRouter, HTTPException
from models.schemas import ChatMessage, ChatResponse
from services.llm import llm_service
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatMessage):
    """Chat with AI concierge"""
    try:
        # Generate response
        response = llm_service.generate_response(
            message=request.message,
            context=request.context or ""
        )
        
        if not response['success']:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate response"
            )
        
        return ChatResponse(
            response=response['response'],
            timestamp=datetime.now(),
            confidence=response.get('confidence', 0.9)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@router.get("/health")
async def health():
    """Chat service health check"""
    return {
        "status": "ok",
        "service": "chat",
        "timestamp": datetime.now()
    }