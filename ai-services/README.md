# 🤖 AI Services

FastAPI + Python microservice for RAG, LLM, and sentiment analysis.

**Stack:** FastAPI | Python 3.10+ | ChromaDB | LangChain | VADER | HuggingFace

---

## 📁 Project Structure

```
ai-services/
├── app/
│   ├── main.py                  # FastAPI app entry
│   ├── config.py                # Configuration
│   ├── routers/
│   │   ├── concierge.py         # AI chat endpoints
│   │   ├── rag.py               # Knowledge base endpoints
│   │   └── sentiment.py         # Sentiment analysis
│   ├── services/
│   │   ├── rag_service.py       # RAG pipeline
│   │   ├── llm_service.py       # LLM integration
│   │   ├── embedding_service.py # Embeddings
│   │   ├── sentiment_service.py # Sentiment analysis
│   │   └── cache_service.py     # Redis caching
│   ├── models/
│   │   └── schemas.py           # Pydantic models
│   ├── utils/
│   │   ├── logger.py
│   │   └── validators.py
│   └── chroma-data/             # Local vector DB
├── tests/
│   ├── test_concierge.py
│   ├── test_rag.py
│   └── test_sentiment.py
├── requirements.txt
├── README.md
└── .env (copy from parent)
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- pip or conda

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp ../.env .env

# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Server runs on `http://localhost:8001`

API docs at `http://localhost:8001/docs`

---

## 📝 Available Endpoints

### Concierge (AI Chat)

```
POST   /ai/concierge/chat        Chat with AI (RAG-powered)
```

**Request:**
```json
{
  "message": "What time is checkout?",
  "guest_id": "123",
  "session_id": "session-456",
  "stream": false
}
```

**Response:**
```json
{
  "response": "Checkout is at 11:00 AM...",
  "sources": [
    {
      "document": "Hotel Policies",
      "excerpt": "..."
    }
  ],
  "confidence": 0.95
}
```

### RAG (Knowledge Base)

```
POST   /ai/rag/ingest            Upload document to knowledge base
GET    /ai/rag/documents         List all knowledge base documents
POST   /ai/rag/query             Query knowledge base directly
DELETE /ai/rag/documents/{id}    Remove document
```

**Ingest Document:**
```json
{
  "content": "Hotel FAQs content...",
  "metadata": {
    "source": "faq",
    "category": "policies"
  }
}
```

### Sentiment Analysis

```
POST   /ai/sentiment/analyze     Analyze single text
POST   /ai/sentiment/batch       Batch analyze multiple texts
```

**Request:**
```json
{
  "text": "The hotel was amazing! Staff was very helpful."
}
```

**Response:**
```json
{
  "sentiment": "positive",
  "score": 0.92,
  "key_phrases": ["hotel", "staff", "helpful"]
}
```

---

## 🧠 RAG Pipeline

The knowledge base uses **Retrieval-Augmented Generation (RAG)**:

1. **Document Ingestion**: Convert .md, .txt, .pdf to chunks
2. **Embedding**: Generate embeddings using `sentence-transformers`
3. **Vector Storage**: Store in ChromaDB (local)
4. **Retrieval**: Find similar documents based on query
5. **Generation**: Feed retrieved docs + query to LLM

```
User Query
    ↓
Embedding Generation (sentence-transformers)
    ↓
Vector Search (ChromaDB)
    ↓
Retrieve Top-K Documents
    ↓
Build RAG Prompt
    ↓
Send to LLM (Groq → Gemini fallback)
    ↓
Stream Response
```

---

## 🔄 LLM Selection Logic

**Primary: Groq (Llama 3.3 70B)**
- 30 requests/min, 1000/day
- Ultra-fast, free tier
- Best for hospitality domain

**Fallback: Google Gemini**
- 15 requests/min, 250K tokens/min
- More reliable rate limits
- Fallback if Groq quota exceeded

```python
async def get_llm_response(prompt: str):
    try:
        response = await groq_client.invoke(prompt)
        return response
    except RateLimitError:
        # Auto-switch to Gemini
        response = await gemini_client.invoke(prompt)
        return response
```

---

## 🎯 Sentiment Analysis

Uses **VADER** (fast, no ML model needed) + **HuggingFace** for phrases:

```python
from services.sentiment_service import analyze_sentiment

result = await analyze_sentiment(
    text="The room was clean but the WiFi was slow.",
    extract_phrases=True
)
# Returns: {
#   sentiment: "neutral",
#   score: 0.45,
#   key_phrases: ["room", "clean", "wifi"]
# }
```

---

## 📊 Knowledge Base Management

### Load documents programmatically:

```python
from services.rag_service import rag_pipeline

# Single document
await rag_pipeline.ingest_document(
    content="Hotel WiFi: Available in all rooms...",
    metadata={"source": "hotel_policies"}
)

# Multiple documents
documents = [
    {"content": "FAQ 1...", "metadata": {"category": "faq"}},
    {"content": "Menu...", "metadata": {"category": "dining"}},
]
await rag_pipeline.ingest_batch(documents)

# Query
results = await rag_pipeline.query("WiFi password", top_k=3)
```

### Via API:

```bash
# Upload document
curl -X POST http://localhost:8001/ai/rag/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hotel WiFi password: 123456",
    "metadata": {"source": "it"}
  }'

# Query
curl -X POST http://localhost:8001/ai/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "WiFi password"}'
```

---

## 🔐 Caching

Redis caching for frequently accessed data:

```python
# Automatic caching in RAG
cached_results = await rag_pipeline.query(
    "Checkout time",
    use_cache=True,
    cache_ttl=3600  # 1 hour
)
```

---

## 🧪 Testing

Pytest for all modules:

```bash
# Run all tests
pytest

# With coverage
pytest --cov=app tests/

# Watch mode
pytest-watch

# Specific test
pytest tests/test_rag.py::test_ingest_document
```

---

## 🚀 Deployment

### Deploy to Render

```bash
# 1. Create Render Web Service
# 2. Connect GitHub repo
# 3. Set environment:
GROQ_API_KEY=...
GEMINI_API_KEY=...
UPSTASH_REDIS_URL=...
# 4. Deploy!
```

### Docker (Optional)

```dockerfile
FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

Build & run:
```bash
docker build -t ai-services .
docker run -p 8001:8001 ai-services
```

---

## 🔌 ChromaDB (Local Vector Database)

Runs **in-process** — no separate service needed!

```python
import chromadb

client = chromadb.Client()
collection = client.get_or_create_collection("hospitality_kb")

# Add documents
collection.add(
    ids=["doc1", "doc2"],
    embeddings=[[...], [...]],
    documents=["FAQ content...", "Policy..."],
    metadatas=[{"source": "faq"}, {"source": "policy"}]
)

# Query
results = collection.query(
    query_embeddings=[[...]],
    n_results=3
)
```

Data persists in `./chroma-data/` directory.

---

## 📝 Example: Building a Chat Flow

```python
from fastapi import APIRouter
from services.rag_service import rag_pipeline
from services.llm_service import llm

router = APIRouter(prefix="/ai")

@router.post("/concierge/chat")
async def chat(message: str, guest_id: str):
    # 1. Retrieve relevant documents
    docs = await rag_pipeline.query(message, top_k=3)
    
    # 2. Build RAG prompt
    prompt = f"""
    You are a helpful hotel concierge. Use the following hotel info to answer:
    
    {docs}
    
    Guest question: {message}
    """
    
    # 3. Get LLM response
    response = await llm.invoke(prompt)
    
    # 4. Analyze sentiment of question
    sentiment = await sentiment_service.analyze(message)
    
    # 5. Return response
    return {
        "response": response,
        "guest_sentiment": sentiment,
        "sources": docs
    }
```

---

## 🐛 Common Issues

### ChromaDB not found?
```bash
# It's embedded - create data directory
mkdir chroma-data
```

### Groq API rate limit?
- Fallback to Gemini is automatic
- Check `GROQ_API_KEY` is valid

### Slow embeddings?
- First run downloads model (~400MB)
- Subsequent runs are cached
- Use GPU if available (install `torch-cuda`)

### Module import errors?
```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

---

## 📚 Resources

- [FastAPI](https://fastapi.tiangolo.com)
- [LangChain](https://docs.langchain.com)
- [ChromaDB](https://docs.trychroma.com)
- [Groq API](https://console.groq.com)
- [Sentence Transformers](https://www.sbert.net)

---

## 📄 License

MIT