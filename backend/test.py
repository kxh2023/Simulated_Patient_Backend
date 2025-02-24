from pathlib import Path

import os
print(os.getcwd())  # Prints the current working directory


text_file_path = Path("./backend/tts_sample/tts1.txt")
with text_file_path.open("r", encoding="utf-8") as f:
            input_text = f.read()
print(input_text)

directory = "./backend/sim_patient_data"  # Remove the ./ to test

print(os.path.exists(directory))