from fastapi import APIRouter, HTTPException
from models.schemas import RAGQuery, RAGResponse, Document
from services.llm import llm_service
from services.embeddings import embedding_service
from datetime import datetime
import logging
import json
import os

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai/rag", tags=["rag"])

# Knowledge base storage (in-memory for now)
knowledge_base = {}

def load_knowledge_base():
    """Load knowledge base from files"""
    global knowledge_base
    knowledge_dir = "knowledge"
    
    if not os.path.exists(knowledge_dir):
        return
    
    for file in os.listdir(knowledge_dir):
        if file.endswith('.txt'):
            with open(os.path.join(knowledge_dir, file), 'r') as f:
                content = f.read()
                knowledge_base[file] = {
                    "content": content,
                    "title": file.replace('.txt', ''),
                    "embedding": embedding_service.embed_text(content)
                }

@router.post("/ingest")
async def ingest_document(doc: Document):
    """Add document to knowledge base"""
    try:
        doc_id = f"{doc.title or 'doc'}_{len(knowledge_base)}"
        
        knowledge_base[doc_id] = {
            "content": doc.content,
            "title": doc.title,
            "category": doc.category,
            "embedding": embedding_service.embed_text(doc.content),
            "metadata": doc.metadata or {}
        }
        
        return {
            "success": True,
            "doc_id": doc_id,
            "message": "Document ingested successfully"
        }
    
    except Exception as e:
        logger.error(f"Ingest error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to ingest document"
        )

@router.post("/query", response_model=RAGResponse)
async def query_knowledge_base(request: RAGQuery):
    """Query knowledge base with AI"""
    try:
        if not knowledge_base:
            load_knowledge_base()
        
        if not knowledge_base:
            return RAGResponse(
                answer="No documents in knowledge base",
                sources=[],
                confidence=0.0
            )
        
        # Find relevant documents
        query_embedding = embedding_service.embed_text(request.query)
        similarities = []
        
        for doc_id, doc in knowledge_base.items():
            if doc.get('embedding'):
                sim = embedding_service.similarity(request.query, doc['content'])
                similarities.append((doc_id, sim, doc))
        
        # Sort by similarity
        similarities.sort(key=lambda x: x[1], reverse=True)
        top_docs = similarities[:request.top_k]
        
        # Create context from top documents
        context = "\n\n".join([
            f"Source: {doc['title']}\n{doc['content'][:500]}"
            for _, _, doc in top_docs
        ])
        
        # Generate answer
        response = llm_service.generate_response(
            message=request.query,
            context=context
        )
        
        sources = [doc['title'] for _, _, doc in top_docs]
        
        return RAGResponse(
            answer=response['response'],
            sources=sources,
            confidence=response.get('confidence', 0.9)
        )
    
    except Exception as e:
        logger.error(f"Query error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to query knowledge base"
        )

@router.get("/documents")
async def list_documents():
    """List all documents in knowledge base"""
    try:
        if not knowledge_base:
            load_knowledge_base()
        
        docs = [
            {
                "id": doc_id,
                "title": doc.get('title'),
                "category": doc.get('category')
            }
            for doc_id, doc in knowledge_base.items()
        ]
        
        return {"documents": docs, "total": len(docs)}
    
    except Exception as e:
        logger.error(f"List documents error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to list documents"
        )

# Load knowledge base on startup
load_knowledge_base()