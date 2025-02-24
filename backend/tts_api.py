from pathlib import Path
from openai import OpenAI, AssistantEventHandler
from dotenv import load_dotenv
import os

class TTSClient:
    """
    A simple client for OpenAI's text-to-speech (TTS) API.
    
    This client supports:
      - Synthesis from a direct text string.
      - Synthesis from the contents of a text file.
    
    It sends the text (along with parameters like model and voice) to the TTS API
    and streams the resulting audio to a specified file.
    """
    def __init__(self, model: str = "tts-1", voice: str = "alloy", API_KEY=None):
        
        if not API_KEY:
            load_dotenv()
            API_KEY = os.environ.get("API_KEY")
        
        self.client = OpenAI(api_key=API_KEY)
        self.model = model
        self.voice = voice

    def synthesize_from_text(self, text: str, output_filename: str = "speech.mp3") -> None:
        """
        Synthesize speech from the provided text and stream the audio to a file.
        
        What is sent:
          - The text content.
          - Parameters such as model and voice.
        
        What is received:
          - A streaming response containing the generated audio data.
          - The audio is streamed in chunks to avoid waiting for the full response.
        
        Parameters:
          text (str): The text to be converted into speech.
          output_filename (str): The filename where the audio will be saved.
        """
        
            # Define the directory where recordings will be saved
        recordings_dir = os.path.join(os.getcwd(), "backend", "recordings")
        
        # Ensure the directory exists
        os.makedirs(recordings_dir, exist_ok=True)
        
        # Construct the full file path
        speech_file_path = os.path.join(recordings_dir, output_filename)
        
        # Generate speech and stream it to the file
        response = self.client.audio.speech.create(
            model=self.model,
            voice=self.voice,
            input=text
        )
        response.stream_to_file(speech_file_path)
        
        print(f"Audio has been saved to: {speech_file_path}")
        return speech_file_path

    def synthesize_from_file(self, text_file_path: str, output_filename: str = "speech.mp3") -> None:
        """
        Read text from a file and synthesize speech, streaming the output to a file.
        
        This method reads the content of a text file, sends it to the TTS API,
        and writes the resulting audio data to the specified output file.
        
        Parameters:
          text_file (str): The name (or path) of the input text file.
          output_filename (str): The filename where the audio will be saved.
        """
        text_file_path = Path(text_file_path)
        with text_file_path.open("r", encoding="utf-8") as f:
            input_text = f.read()
        return self.synthesize_from_text(input_text, output_filename)