import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
    DATABASE_URL = os.getenv('DATABASE_URL')
    NODE_ENV = os.getenv('NODE_ENV', 'development')
    
    # LLM Settings
    LLM_MODEL = 'mixtral-8x7b-32768'  # Groq model
    LLM_TEMPERATURE = 0.7
    LLM_MAX_TOKENS = 1024
    
    # Embeddings
    EMBEDDING_MODEL = 'all-MiniLM-L6-v2'
    
    # API
    API_HOST = '0.0.0.0'
    API_PORT = 8001
    
    # CORS
    CORS_ORIGINS = ['*']

settings = Settings()