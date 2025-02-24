# Patient Simulation
This project simulates patient interactions using OpenAI's Assistants API and provides a user interface for managing and interacting with these simulated patients.  The system allows users to select patient profiles, initiate conversations, receive audio responses via text-to-speech, and record interactions.

## Features
* **Patient Profile Selection:** Choose from a variety of pre-defined patient profiles with different characteristics and dialogue styles.
* **Real-time Conversation:** Engage in natural language conversations with the simulated patient.
* **Audio Feedback:**  Receive audio responses from the simulated patient via text-to-speech (TTS).
* **Speech-to-Text:** (Frontend) Convert your spoken words into text input for the simulated patient interaction.
* **Audio Recording and Visualization:** Record and visualize both the user's speech and the simulated patient's response.
* **Multiple Patient Support:** Handle multiple simulations simultaneously (though not implemented in current design).
* **Backend API:**  A RESTful API manages patient creation, message handling, and TTS generation.

## Usage - LOL DONT DO THIS WE DONT HAVE A REQUIREMENTS FILE - DONT
1. **Backend Setup:**
    * Install dependencies: `pip install -r backend/requirements.txt`
    * Set your OpenAI API key in a `.env` file: `API_KEY=your_api_key`
    * Run the backend server: `python backend/service.py`
2. **Frontend Setup:**
    * Navigate to the `front` directory.
    * Install dependencies: `npm install` or `yarn install`
    * Run the development server: `npm run dev` or `yarn dev`
3. **Interaction:**
    * Select a patient profile from the carousel.
    * Click "Start" to begin the conversation.
    * Speak or type your messages, and receive audio and text responses.

## Technologies Used
* **Python (Backend):**  Handles API routes, OpenAI API interaction, and TTS processing.
* **Flask (Backend):** The web framework used to build the backend API.
* **OpenAI API (Backend):** Provides the language models for patient simulation and text-to-speech capabilities.
* **TypeScript (Frontend):** Used for static typing and enhanced code maintainability.
* **React (Frontend):**  The JavaScript library for building the user interface.
* **Tailwind CSS (Frontend):**  A utility-first CSS framework for rapid UI development.
* **React Router (Frontend):**  Manages navigation between different pages in the frontend.
* **react-speech-recognition (Frontend):** Speech-to-text functionality.
* **react-audio-visualize (Frontend):** Audio visualization.
* **Framer Motion (Frontend):** Animations and UI interactions.

## API Documentation
### `/create_patient` (POST)

**Request:**

```json
{
  "name": "PatientName",
  "instructions": "InstructionKey",
  "model": "gpt-4o" 
}
```

**Response:**

```json
{
  "status": "Patient created"
}
```

### `/send_message` (POST)

**Request:**

```json
{
  "message": "User message"
}
```

**Response:** (Sends an MP3 file)

```
(audio/mpeg file)
```

### `/patients` (GET)

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Patient 1",
      "description": "Description of patient 1",
      "tags": ["tag1", "tag2"]
    },
    // ... more patients
  ]
}
```

### `/ttsfeedback` (POST)

**Request:**

```json
{
  "message": "Text for TTS feedback"
}
```

**Response:**

```json
{
  "response": "Feedback received"
}
```

## Configuration
This project uses a combination of environment variables and configuration files for customization.

**Environment Variables:**

The backend requires an OpenAI API key.  Set the `API_KEY` environment variable in a `.env` file located in the `backend` directory.  Do not commit this file to version control.  Example:

```
API_KEY=your-openai-api-key
```

**Configuration Files:**

Patient profiles are defined in JSON files within the `backend/sim_patient_data` directory. Each file represents a single patient with a name, description, instructions (key referencing an instruction file), and tags.  The structure of these files is shown below.  New patient profiles can be added by creating new JSON files following this format.

```json
{
  "id": 1,
  "name": "Patient 1",
  "description": "Description of Patient 1",
  "instructions": "instruction_key_1",
  "tags": ["tag1", "tag2"]
}
```

Patient instructions are stored as text files in the `backend/sim_patient_instructions` directory.  Each file should contain detailed instructions for the OpenAI assistant to simulate patient behavior. The filename should match the `instructions` key in the corresponding JSON patient profile.

**Customization Options:**

* **Patient Profiles:** Create new patient profiles by adding JSON files to the `backend/sim_patient_data` directory as described above.
* **Instruction Sets:** Customize patient behavior by modifying the instruction text files in the `backend/sim_patient_instructions` directory.
* **OpenAI Models:** The backend can use different OpenAI models (specified in the patient profile JSON) to alter the conversational style and capabilities of the simulated patient.  Currently, the `gpt-4o` model is used.
* **Frontend Styling:** The frontend uses Tailwind CSS.  Customization can be done by modifying the `front/tailwind.config.js` file and associated CSS files.

LOL DONT DO THIS, IT WILL FUCK YOUR COMPUTER UP
**Backend Setup:**  Ensure that the necessary Python packages are installed (`pip install -r backend/requirements.txt`). Then, run the backend using `python backend/service.py`. The backend will listen on port 5001.

**Frontend Setup:**  After installing Node modules (`npm install`), run the frontend development server (`npm run dev`). The frontend will automatically connect to the backend.

*README.md was made with [Etchr](https://etchr.dev)*
