from sentence_transformers import SentenceTransformer
import numpy as np
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            self.model = None

    def embed_text(self, text: str) -> list:
        """Convert text to embeddings"""
        try:
            if not self.model:
                return []
            
            embeddings = self.model.encode(text, convert_to_tensor=False)
            return embeddings.tolist()
        
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            return []

    def similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts"""
        try:
            if not self.model:
                return 0.0
            
            embeddings1 = self.model.encode(text1)
            embeddings2 = self.model.encode(text2)
            
            similarity = np.dot(embeddings1, embeddings2) / (
                np.linalg.norm(embeddings1) * np.linalg.norm(embeddings2)
            )
            
            return float(similarity)
        
        except Exception as e:
            logger.error(f"Similarity calculation error: {e}")
            return 0.0

embedding_service = EmbeddingService()