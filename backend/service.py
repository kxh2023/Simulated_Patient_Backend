from flask import Flask, request, jsonify, send_file
from dotenv import load_dotenv
import os
import requests
import json
import re
from flask_cors import CORS
import time

service = Flask(__name__)
CORS(service)

load_dotenv()

from open_api import AssistantClient
from tts_api import TTSClient

API_KEY = os.getenv("API_KEY")
assistant_client = AssistantClient(API_KEY)
tts_client = TTSClient(API_KEY=API_KEY)

#Helper Methods
def get_instruction_text(instruction_key):

    file_path = os.path.join("sim_patient_instructions", f"{instruction_key}.txt")
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        print("there is no file found")
        return "Placeholder"

@service.route('/create_patient', methods=['POST'])
def create_patient():
    data = request.json
    name = data.get('name', 'Patient')
    instruction_key = data.get('instructions')
    if instruction_key is None:
        return jsonify({"error": "No instructions provided"}), 400
        
    instructions = get_instruction_text(instruction_key)
    print("given instructions", instructions)
    model = data.get('model', 'gpt-4o')
    
    assistant_client.create_patient(name, instructions, model)
    
    print("sent")
    return jsonify({"status": "Patient created"}), 201

@service.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    if 'message' not in data:
        return jsonify({"error": "No message provided"}), 400
    
    message = data.get('message', 'NO MESSAGE FROM FRONTEND')
    response = assistant_client.send_message(message)
    
    filename = f"speech_{int(time.time())}.mp3"
    filepath = tts_client.synthesize_from_text(response, filename)
    
    
    print("sent")
    print(filepath)
    try:
        return send_file(
            filepath,
            mimetype="audio/mpeg",
            as_attachment=True,
            download_name=filename
        ), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@service.route('/ttsfeedback', methods=['POST'])
def tts_feedback():
    data = request.json
    if 'message' not in data:
        return jsonify({"error": "No message provided"}), 400
    message = data.get('message', 'NO MESSAGE FROM FRONTEND')
    tts_client.synthesize_from_text(message, "sugma.mp3")
    #path = os.path.join(os.getcwd(), "backend", "tts_sample", "tts1.mp3")
    path = "./backend/tts_sample/tts1.txt"
    tts_client.synthesize_from_file(path, "ligma.mp3")
    return jsonify({"response": "Feedback received"}), 201

def get_patient_list():
    print(f"Current working directory: {os.getcwd()}")
    patients = []
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    directory = os.path.join(BASE_DIR, "sim_patient_data")  # Remove the ./ to test
    print(f"Looking in directory: {directory}")
    
    try:
        if not os.path.exists(directory):
            print(f"Directory not found: {directory}")
            raise FileNotFoundError(f"Directory {directory} does not exist")
        
        print(f"Directory exists, contains: {os.listdir(directory)}")
        files = os.listdir(directory)
        print(f"Files in directory: {files}")
            
        # Iterate through all files in the directory
        for filename in os.listdir(directory):
            # Check if the file is a JSON file
            if filename.endswith('.json'):
                file_path = os.path.join(directory, filename)
                
                try:
                    # Open and read the JSON file
                    with open(file_path, 'r') as file:
                        patient_data = json.load(file)
                        
                    # Extract required fields and validate data types
                    patient = {
                        'id': int(patient_data['id']),  # Ensure id is an integer
                        'name': str(patient_data['name']),  # Ensure name is a string
                        'description': str(patient_data['description']),  # Ensure description is a string
                        'tags': list(patient_data['tags'])  # Ensure tags is a list
                    }
                    
                    patients.append(patient)
                    
                except (json.JSONDecodeError, KeyError) as e:
                    print(f"Error processing {filename}: {str(e)}")
                except Exception as e:
                    print(f"Unexpected error processing {filename}: {str(e)}")
                    
    except Exception as e:
        print(f"Error accessing directory: {str(e)}")
        
    return patients

@service.route('/patients', methods=['GET'])
def get_patients():
    print("Received request for /patients")  # Debug print
    try:
        print("Getting patient list...")     # Debug print
        patients = get_patient_list()
        print(f"Found patients: {patients}") # Debug print
        return jsonify({
            "status": "success",
            "data": patients
        }), 200
    except Exception as e:
        print(f"Error occurred: {str(e)}")   # Debug print
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    

if __name__ == "__main__":
    service.run(debug=True, port = 5001)
