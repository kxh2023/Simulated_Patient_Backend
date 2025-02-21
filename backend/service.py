from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import requests
import json
import re

service = Flask(__name__)

load_dotenv()

from open_api import AssistantClient

API_KEY = os.getenv("API_KEY")
assistant_client = AssistantClient(API_KEY)

@service.route('/create_patient', methods=['POST'])
def create_patient():
    data = request.json
    name = data.get('name', 'Patient')
    instruction_key = data.get('instructions')
    if instruction_key is None:
        return jsonify({"error": "No instructions provided"}), 400
        
    instructions = get_instruction_text(instruction_key)
    model = data.get('model', 'gpt-4o')
    
    assistant_client.create_patient(name, instructions, model)
    return jsonify({"status": "Patient created"}), 201

@service.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    if 'message' not in data:
        return jsonify({"error": "No message provided"}), 400
    
    message = data.get('message', 'NO MESSAGE FROM FRONTEND')
    response = assistant_client.send_message(message)
    return jsonify({"response": response}), 201

def get_instruction_text(instruction_key):

    file_path = os.path.join("sim_patient_instructions", f"{instruction_key}.txt")

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        return "Placeholder"