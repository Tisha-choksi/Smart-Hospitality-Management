from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Smart Hospitality AI Services", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "AI Services are running ✅"}

@app.get("/")
async def root():
    return {"message": "Smart Hospitality AI Services API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)