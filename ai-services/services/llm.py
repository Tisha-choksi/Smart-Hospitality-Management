from groq import Groq
import google.generativeai as genai
from config import settings
import logging

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel('gemini-pro')

    def chat_with_groq(self, message: str, context: str = "") -> str:
        """Chat using Groq LLM"""
        try:
            system_prompt = f"""You are a helpful hotel concierge assistant. 
You help guests with:
- Room service requests
- Local recommendations
- Hotel amenities and services
- Guest services

Be friendly, professional, and concise.

Context: {context}
"""
            
            completion = self.groq_client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                temperature=settings.LLM_TEMPERATURE,
                max_tokens=settings.LLM_MAX_TOKENS,
            )
            
            return completion.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Groq error: {e}")
            return self.chat_with_gemini(message, context)

    def chat_with_gemini(self, message: str, context: str = "") -> str:
        """Fallback to Gemini"""
        try:
            response = self.gemini_model.generate_content(
                f"{context}\n\nUser: {message}"
            )
            return response.text
        
        except Exception as e:
            logger.error(f"Gemini error: {e}")
            return "I apologize, but I'm having trouble processing your request. Please try again."

    def generate_response(self, message: str, context: str = "") -> dict:
        """Generate AI response with error handling"""
        try:
            response_text = self.chat_with_groq(message, context)
            
            return {
                "success": True,
                "response": response_text,
                "confidence": 0.95
            }
        
        except Exception as e:
            logger.error(f"LLM generation error: {e}")
            return {
                "success": False,
                "response": "Unable to generate response",
                "confidence": 0.0
            }

llm_service = LLMService()