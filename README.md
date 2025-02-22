# poopoopeepee

poop

curl -X POST "http://127.0.0.1:5000/create_patient" -H "Content-Type: application/json" -d '{"name": "John Doe", "instructions": "tts1.txt", "model": "gpt-4o"}'
curl -X POST "http://127.0.0.1:5000/send_message" -H "Content-Type: application/json" -d '{"message": "Hello, how are you?"}'
curl -X POST "http://127.0.0.1:5000/tts_feedback" -H "Content-Type: application/json" -d '{"message": "Sugma?"}'
