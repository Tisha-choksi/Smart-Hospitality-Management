# 🏨 Smart Hospitality Management — 100% Free Stack Guide

> **Every tool, API, and service in this project is completely free.** No credit cards, no API keys to buy, no hidden costs.

---

## 🔄 What Changed: Paid → Free Replacements

| Component | ❌ Paid (Old Plan) | ✅ Free Replacement | Notes |
|---|---|---|---|
| **LLM** | OpenAI GPT-4o ($) | **Ollama + Llama 3.1 / Mistral** | Runs locally on your machine, no API key |
| **Embeddings** | OpenAI text-embedding-3-small ($) | **HuggingFace all-MiniLM-L6-v2** | Local model via `sentence-transformers`, no API |
| **Vector Database** | ChromaDB | **ChromaDB** ✅ | Already free & open-source |
| **Maps API** | Google Maps ($) | **OpenStreetMap + Leaflet.js** | Completely free, no API key required |
| **Email/SMS** | SendGrid / Twilio ($) | **Nodemailer + Gmail SMTP** | Free for low volume (500/day) |
| **Database** | PostgreSQL | **PostgreSQL (Docker)** ✅ | Already free |
| **Cache** | Redis | **Redis (Docker)** ✅ | Already free |
| **Automation** | n8n | **n8n (self-hosted)** ✅ | Already free when self-hosted |
| **CI/CD** | GitHub Actions | **GitHub Actions** ✅ | Free for public repos (2000 min/month private) |
| **Hosting** | AWS / GCP ($) | **Vercel (frontend) + Render (backend)** | Free tiers available |
| **Sentiment** | HuggingFace / VADER | **VADER + local HuggingFace** ✅ | Already free, runs locally |

---

## 🤖 Ollama — Your Free Local LLM

### What is Ollama?
Ollama lets you run powerful LLMs (Llama 3.1, Mistral, Gemma 2, Phi-3) **locally on your machine** — no API keys, no internet needed, no cost. LangChain has built-in Ollama support.

### System Requirements

| Spec | Minimum | Recommended |
|---|---|---|
| **RAM** | 8 GB | 16 GB+ |
| **Storage** | 5 GB (per model) | 20 GB+ |
| **GPU** | Not required (CPU works) | NVIDIA GPU with 6GB+ VRAM (much faster) |
| **OS** | Windows 10/11, macOS, Linux | Any |

### Installation

```bash
# 1. Download Ollama from https://ollama.com/download
# 2. Install it (Windows installer or command below for Linux/Mac)

# For Windows: Download and run the installer from ollama.com

# 3. Verify installation
ollama --version

# 4. Pull your LLM model (choose ONE based on your RAM)
```

### Recommended Models (pick based on your hardware)

| Model | Size | RAM Needed | Quality | Command |
|---|---|---|---|---|
| **Llama 3.1 8B** | ~4.7 GB | 8 GB | ⭐⭐⭐⭐ Best balance | `ollama pull llama3.1` |
| **Mistral 7B** | ~4.1 GB | 8 GB | ⭐⭐⭐⭐ Great for chat | `ollama pull mistral` |
| **Phi-3 Mini** | ~2.3 GB | 4 GB | ⭐⭐⭐ Lightweight | `ollama pull phi3:mini` |
| **Gemma 2 9B** | ~5.4 GB | 10 GB | ⭐⭐⭐⭐ Google's model | `ollama pull gemma2` |
| **Llama 3.1 70B** | ~40 GB | 48 GB | ⭐⭐⭐⭐⭐ Best quality | `ollama pull llama3.1:70b` |

> [!TIP]
> **Start with `llama3.1` (8B)** — it's the best balance of quality and speed for most machines. If your PC has less than 8 GB RAM, use `phi3:mini`.

### Running Ollama

```bash
# Pull the model (one-time download)
ollama pull llama3.1

# Start the Ollama server (runs in background)
ollama serve

# Test it works
ollama run llama3.1 "Hello, what can you help me with?"

# API is available at http://localhost:11434
# Test API:
curl http://localhost:11434/api/tags
```

### Using Ollama with LangChain (Python)

```python
from langchain_ollama import ChatOllama, OllamaEmbeddings

# Chat model — replaces OpenAI GPT-4
llm = ChatOllama(
    model="llama3.1",
    base_url="http://localhost:11434",
    temperature=0.7,
)

response = llm.invoke("What are the best restaurants near a 5-star hotel?")
print(response.content)

# Embeddings — replaces OpenAI embeddings
embeddings = OllamaEmbeddings(
    model="llama3.1",
    base_url="http://localhost:11434",
)
```

---

## 🧬 Free Local Embeddings — sentence-transformers

### Why this instead of Ollama embeddings?
`sentence-transformers` with `all-MiniLM-L6-v2` is **faster and more accurate** for embeddings than Ollama's embedding mode. It's the industry standard for free local embeddings.

### Installation & Usage

```python
# Install
pip install sentence-transformers

# Usage in our RAG pipeline
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",  # ~80MB, downloads once
    model_kwargs={"device": "cpu"},   # Use "cuda" if you have NVIDIA GPU
)

# Generate embeddings
vector = embeddings.embed_query("Where is the hotel spa?")
# Returns a 384-dimensional vector — completely free, runs locally
```

### Model Options

| Model | Size | Dimensions | Speed | Quality |
|---|---|---|---|---|
| **all-MiniLM-L6-v2** | 80 MB | 384 | ⚡ Fastest | ⭐⭐⭐⭐ Great |
| **all-mpnet-base-v2** | 420 MB | 768 | 🔄 Medium | ⭐⭐⭐⭐⭐ Best |
| **paraphrase-MiniLM-L3-v2** | 60 MB | 384 | ⚡⚡ Fastest | ⭐⭐⭐ Good |

> [!TIP]
> Use **`all-MiniLM-L6-v2`** — best speed/quality ratio. Model downloads automatically on first use (~80MB one-time download).

---

## 🗺️ Free Maps — OpenStreetMap + Leaflet.js

### Replaces Google Maps (which requires billing)

```html
<!-- Add to your HTML -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div id="map" style="height: 400px;"></div>

<script>
  // Initialize free map — no API key needed!
  const map = L.map('map').setView([19.0760, 72.8777], 14); // Mumbai coords
  
  // Free tile layer from OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add markers for nearby attractions
  L.marker([19.0825, 72.8811])
    .addTo(map)
    .bindPopup('🍽️ Recommended Restaurant');
</script>
```

### In Next.js (React)

```bash
npm install react-leaflet leaflet
```

```jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LocalMap({ places }) {
  return (
    <MapContainer center={[19.076, 72.877]} zoom={14} style={{ height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      {places.map(place => (
        <Marker key={place.id} position={[place.lat, place.lng]}>
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

---

## 📧 Free Email — Nodemailer + Gmail SMTP

### Setup (no paid service needed)

```bash
# Install in backend
cd backend
npm install nodemailer
```

### Gmail App Password Setup
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already
3. Go to **App passwords** → Generate a new app password
4. Use that password in your `.env`

```env
# .env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

```javascript
// backend/src/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"Smart Hospitality" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
```

> **Free limit:** ~500 emails/day with Gmail — more than enough for development & demo.

---

## 🛠️ Updated Tech Stack (100% Free)

| Layer | Technology | Cost |
|---|---|---|
| **Frontend** | Next.js 14 | Free |
| **Styling** | Vanilla CSS | Free |
| **Backend API** | Node.js + Express.js | Free |
| **AI Services** | Python + FastAPI | Free |
| **LLM** | Ollama + Llama 3.1 (local) | Free |
| **LLM Framework** | LangChain | Free |
| **Embeddings** | sentence-transformers (all-MiniLM-L6-v2) | Free |
| **Vector DB** | ChromaDB (Docker) | Free |
| **Primary DB** | PostgreSQL (Docker) | Free |
| **Cache** | Redis (Docker) | Free |
| **Automation** | n8n (self-hosted Docker) | Free |
| **Maps** | OpenStreetMap + Leaflet.js | Free |
| **Email** | Nodemailer + Gmail SMTP | Free |
| **Sentiment** | VADER + HuggingFace (local) | Free |
| **CI/CD** | GitHub Actions | Free (public repos) |
| **Hosting** | Vercel + Render free tiers | Free |
| **Containerization** | Docker + Docker Compose | Free |
| **Monitoring** | Winston + Grafana OSS | Free |

---

## 📄 Updated Environment Variables

```env
# ============================================
# 🏨 Smart Hospitality - FREE Stack Config
# ============================================

# --- General ---
NODE_ENV=development
APP_NAME=SmartHospitality

# --- PostgreSQL (Docker - Free) ---
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=hospitality_db
POSTGRES_USER=hospitality_admin
POSTGRES_PASSWORD=localdev_password_123
DATABASE_URL=postgresql://hospitality_admin:localdev_password_123@localhost:5432/hospitality_db

# --- Redis (Docker - Free) ---
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=localdev_redis_123

# --- Ollama (Local - Free, No API Key!) ---
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
EMBEDDING_MODEL=all-MiniLM-L6-v2

# --- ChromaDB (Docker - Free) ---
CHROMA_HOST=localhost
CHROMA_PORT=8100

# --- Backend ---
BACKEND_PORT=4000
JWT_SECRET=my_super_secret_jwt_key_for_local_dev_1234567890
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000

# --- Frontend ---
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_AI_API_URL=http://localhost:8000/ai
NEXT_PUBLIC_APP_NAME=Smart Hospitality

# --- AI Services ---
AI_SERVICE_PORT=8000

# --- n8n (Docker - Free) ---
N8N_PORT=5678
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin_n8n_local
N8N_WEBHOOK_URL=http://localhost:5678

# --- Email (Gmail SMTP - Free) ---
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
```

---

## 📦 Updated Python Dependencies

```text
# ai-services/requirements.txt

# Framework
fastapi==0.115.0
uvicorn[standard]==0.30.0
python-dotenv==1.0.1
pydantic==2.9.0
pydantic-settings==2.5.0

# LangChain + Ollama (FREE - No OpenAI!)
langchain==0.3.0
langchain-ollama==0.2.0
langchain-community==0.3.0
langchain-chroma==0.2.0
langchain-huggingface==0.1.0

# Embeddings (FREE - Local model)
sentence-transformers==3.1.0

# Vector Store (FREE)
chromadb==0.5.0

# Sentiment Analysis (FREE - Local)
vaderSentiment==3.3.2
transformers==4.44.0

# Utilities
httpx==0.27.0
tiktoken==0.7.0
```

---

## 🔄 Updated AI Service Code Patterns

### Concierge Agent (uses Ollama instead of OpenAI)

```python
# ai-services/app/services/langchain_agent.py

from langchain_ollama import ChatOllama
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferWindowMemory

# FREE local LLM — no API key needed!
llm = ChatOllama(
    model="llama3.1",
    base_url="http://localhost:11434",
    temperature=0.7,
)

# FREE local embeddings — no API key needed!
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"},
)

# Vector store
vectorstore = Chroma(
    collection_name="hotel_knowledge",
    embedding_function=embeddings,
    persist_directory="./chroma_data",
)

# Conversational RAG chain
memory = ConversationBufferWindowMemory(
    memory_key="chat_history",
    return_messages=True,
    k=10,
)

concierge_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    memory=memory,
    verbose=True,
)
```

### Sentiment Analyzer (fully local)

```python
# ai-services/app/services/sentiment_analyzer.py

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def analyze_sentiment(text: str) -> dict:
    scores = analyzer.polarity_scores(text)
    
    # Classify
    compound = scores["compound"]
    if compound >= 0.05:
        sentiment = "positive"
    elif compound <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    return {
        "sentiment": sentiment,
        "score": compound,          # -1.0 to +1.0
        "details": {
            "positive": scores["pos"],
            "neutral": scores["neu"],
            "negative": scores["neg"],
        }
    }

# Usage:
# result = analyze_sentiment("The room was amazing and staff were very helpful!")
# → {"sentiment": "positive", "score": 0.84, ...}
```

---

## 💰 Total Cost Summary

| Item | Cost |
|---|---|
| All software & frameworks | **$0** |
| LLM (Ollama + Llama 3.1) | **$0** |
| Embeddings (sentence-transformers) | **$0** |
| Databases (PostgreSQL, Redis, ChromaDB) | **$0** |
| Automation (n8n self-hosted) | **$0** |
| Maps (OpenStreetMap) | **$0** |
| Email (Gmail SMTP) | **$0** |
| CI/CD (GitHub Actions) | **$0** |
| Hosting (Vercel + Render free tiers) | **$0** |
| **TOTAL** | **$0** ✅ |

---

> [!IMPORTANT]
> **Only prerequisite that costs money: Your computer's electricity** 😄
> 
> The only real constraint is **RAM** — you need at least **8 GB RAM** to run Ollama with Llama 3.1 alongside Docker containers. If you have **16 GB+**, everything will run smoothly.

> [!NOTE]
> **Ready to start building?** Say the word and I'll scaffold the entire project with the free stack — Docker Compose, backend, AI services, and frontend — all configured to use Ollama, local embeddings, and free services.
