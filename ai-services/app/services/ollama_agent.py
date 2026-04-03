"""
🤖 Ollama-based AI Concierge Agent
Replaces OpenAI GPT-4 - 100% FREE and runs locally!
"""

import os
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import LLMChain
from dotenv import load_dotenv

load_dotenv()

# ============================================
# Initialize FREE Ollama Model
# ============================================

llm = ChatOllama(
    model=os.getenv("OLLAMA_MODEL", "llama3.1"),
    base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
    temperature=float(os.getenv("OLLAMA_TEMPERATURE", "0.7")),
    top_p=0.9,
    top_k=40,
)

# Conversation memory for context
memory = ConversationBufferWindowMemory(
    memory_key="chat_history",
    k=10,  # Keep last 10 messages
    return_messages=True,
)

# ============================================
# System Prompt for Hotel Concierge
# ============================================

CONCIERGE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are an AI Concierge for a luxury 5-star hotel. You are helpful, 
    friendly, and knowledgeable about hotel services.
    
    Your responsibilities:
    - Answer questions about rooms, amenities, and services
    - Help guests with restaurant reservations
    - Suggest local attractions and experiences
    - Assist with travel arrangements
    - Provide information about hotel policies
    - Handle guest complaints professionally
    
    Always be courteous and aim to exceed expectations.
    If you don't know something, offer to connect the guest with the front desk.
    """),
    ("human", "{input}"),
    ("ai", "{chat_history}"),
])

# Create conversation chain
concierge_chain = LLMChain(
    llm=llm,
    prompt=CONCIERGE_PROMPT,
    memory=memory,
    verbose=True,
)

# ============================================
# Main Chat Function
# ============================================

async def chat_with_concierge(user_message: str, session_id: str = None) -> dict:
    """
    Send a message to the AI concierge and get a response.
    
    Args:
        user_message: The guest's message
        session_id: Optional session ID for tracking conversations
        
    Returns:
        Dictionary with response and metadata
    """
    try:
        # Get response from Ollama (completely FREE!)
        response = concierge_chain.run(
            input=user_message,
            chat_history="",
        )
        
        return {
            "status": "success",
            "response": response.strip(),
            "model": os.getenv("OLLAMA_MODEL", "llama3.1"),
            "provider": "ollama",  # Not OpenAI!
            "cost": "$0.00",  # Completely FREE!
            "session_id": session_id,
        }
    
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "suggestion": "Make sure Ollama is running: ollama serve",
        }

# ============================================
# Specialized Queries
# ============================================

async def get_room_info(room_type: str) -> str:
    """Get information about a specific room type."""
    prompt = f"""Tell me about our {room_type} rooms in 2-3 sentences.
    Include room size, amenities, and price range."""
    
    response = concierge_chain.run(input=prompt, chat_history="")
    return response.strip()


async def suggest_restaurant(cuisine: str, budget: str = "medium") -> str:
    """Suggest restaurants based on preferences."""
    prompt = f"""Suggest a {budget}-budget {cuisine} restaurant near the hotel.
    Include the name, cuisine, and why I should go there."""
    
    response = concierge_chain.run(input=prompt, chat_history="")
    return response.strip()


async def answer_policy_question(question: str) -> str:
    """Answer questions about hotel policies."""
    prompt = f"""As a hotel concierge, answer this policy question: {question}
    Be professional and helpful."""
    
    response = concierge_chain.run(input=prompt, chat_history="")
    return response.strip()

# ============================================
# Debug Info
# ============================================

def get_model_info() -> dict:
    """Get info about the running model."""
    return {
        "model": os.getenv("OLLAMA_MODEL", "llama3.1"),
        "provider": "ollama",
        "cost": "$0.00",
        "location": "local (running on your machine)",
        "base_url": os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        "setup": "Download Ollama from https://ollama.com then run: ollama pull llama3.1",
    }