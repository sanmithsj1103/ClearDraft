import os
import logging
from dotenv import load_dotenv
import google.generativeai as genai
from app.prompts import PROMPT_TEMPLATES

# Load environment variables from .env file
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the Gemini API
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    logger.error("GEMINI_API_KEY environment variable is not set. ClearDraft will not operate correctly.")
    raise ValueError("GEMINI_API_KEY environment variable is missing. Please set it in backend/.env")
else:
    try:
        genai.configure(api_key=api_key)
        logger.info("Gemini API successfully configured using the provided API key.")
    except Exception as e:
        logger.error(f"Failed to configure Gemini API: {str(e)}")
        raise e

def is_mock_active() -> bool:
    # Mock mode is now fully disabled
    return False

def transcribe_audio(file_bytes: bytes, mime_type: str) -> str:
    """
    Transcribes raw audio bytes using Gemini 2.5 Flash.
    """
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = (
            "You are an expert transcription assistant. Accurately transcribe the spoken audio verbatim. "
            "Correct minor run-on sentences and punctuation, but do not summarize, rephrase, or add any "
            "editorial comments. Output ONLY the raw transcript. If there is no speech, return an empty string."
        )
        
        response = model.generate_content([
            {
                "mime_type": mime_type,
                "data": file_bytes
            },
            prompt
        ])
        
        if not response.text:
            raise ValueError("Empty response received from Gemini API.")
            
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error during Gemini audio transcription: {str(e)}")
        raise e

def generate_polished_content(text: str, mode: str, tone: str = None) -> str:
    """
    Generates structured, formatted content based on raw text and selected mode.
    """
    try:
        if mode not in PROMPT_TEMPLATES:
            raise ValueError(f"Unsupported output mode: {mode}")

        system_instruction = PROMPT_TEMPLATES[mode]
        if mode == "email" and tone:
            system_instruction = system_instruction.format(tone=tone)
        
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_instruction
        )
        
        response = model.generate_content(text)
        
        if not response.text:
            raise ValueError("Empty response received from Gemini API.")
            
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error during Gemini content generation: {str(e)}")
        raise e
