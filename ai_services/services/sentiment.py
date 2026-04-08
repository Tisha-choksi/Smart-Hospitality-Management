from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import logging

logger = logging.getLogger(__name__)

class SentimentService:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def analyze(self, text: str) -> dict:
        """Analyze sentiment of text using VADER"""
        try:
            scores = self.analyzer.polarity_scores(text)
            
            # Determine sentiment based on compound score
            compound = scores['compound']
            if compound >= 0.05:
                sentiment = 'POSITIVE'
            elif compound <= -0.05:
                sentiment = 'NEGATIVE'
            else:
                sentiment = 'NEUTRAL'
            
            # Calculate confidence
            confidence = max(
                scores['pos'],
                scores['neg'],
                scores['neu']
            )
            
            return {
                "success": True,
                "sentiment": sentiment,
                "confidence": round(confidence, 2),
                "scores": {
                    "positive": round(scores['pos'], 2),
                    "negative": round(scores['neg'], 2),
                    "neutral": round(scores['neu'], 2),
                    "compound": round(scores['compound'], 2)
                },
                "text": text
            }
        
        except Exception as e:
            logger.error(f"Sentiment analysis error: {e}")
            return {
                "success": False,
                "sentiment": "UNKNOWN",
                "confidence": 0.0,
                "scores": {},
                "error": str(e)
            }

sentiment_service = SentimentService()