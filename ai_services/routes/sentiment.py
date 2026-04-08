from fastapi import APIRouter, HTTPException
from models.schemas import SentimentRequest, SentimentResponse
from services.sentiment import sentiment_service
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai/sentiment", tags=["sentiment"])

@router.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """Analyze sentiment of text"""
    try:
        result = sentiment_service.analyze(request.text)
        
        if not result['success']:
            raise HTTPException(
                status_code=500,
                detail="Failed to analyze sentiment"
            )
        
        return SentimentResponse(
            sentiment=result['sentiment'],
            confidence=result['confidence'],
            scores=result['scores'],
            text=request.text
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@router.post("/batch")
async def analyze_batch(texts: list[str]):
    """Analyze sentiment of multiple texts"""
    try:
        results = [sentiment_service.analyze(text) for text in texts]
        return {"results": results}
    
    except Exception as e:
        logger.error(f"Batch sentiment analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )