from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    user_id: Optional[str] = None
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    confidence: float = 1.0

class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)

class SentimentResponse(BaseModel):
    sentiment: str  # POSITIVE, NEGATIVE, NEUTRAL
    confidence: float
    scores: dict
    text: str

class Document(BaseModel):
    content: str
    title: Optional[str] = None
    category: Optional[str] = None
    metadata: Optional[dict] = None

class RAGQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    top_k: int = Field(3, ge=1, le=10)

class RAGResponse(BaseModel):
    answer: str
    sources: List[str]
    confidence: float

class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime