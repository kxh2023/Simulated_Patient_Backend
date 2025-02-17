from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import requests
import json
import re

service = Flask(__name__)

load_dotenv()

API_KEY = os.getenv("API_KEY")