from openai import OpenAI, AssistantEventHandler
import time
from typing_extensions import override
import os
from dotenv import load_dotenv


class AssistantClient:
    
    def __init__(self, API_KEY=None):
        
        if not API_KEY:
            load_dotenv()
            API_KEY = os.environ.get("API_KEY")
        
        self.client = OpenAI(api_key=API_KEY)
        self.thread = None
        self.assistant = None
        self.message_list = []

    def create_patient(
        self,
        name: str = "Patient",
        instructions: str = "Placeholder",
        model: str = "gpt-4o",
    ) -> None:
        
        #Creates a new assistant (this is the patient)
        self.assistant = self.client.beta.assistants.create(
            name=name,
            instructions=instructions,
            tools=[{"type": "code_interpreter"}],
            model=model,
        )
        
        print("received")
        
        #this is a new message thread
        self.thread = self.client.beta.threads.create()
        
    def retrieve_last_message(self):
        """
        Retrieves the latest message from the assistant.
        """
        messages = self.client.beta.threads.messages.list(thread_id=self.thread.id)
        return messages[-1] if messages else None

    def send_message(self, message: str):
        
        #self.message_list.append(('User', message)) - should append message id instead to save space
        
        response = self.client.beta.threads.messages.create(
            thread_id=self.thread.id,
            role="user",
            content=message,
        )
        
        run = self.client.beta.threads.runs.create(
            thread_id=self.thread.id,
            assistant_id=self.assistant.id
        )
        
        print("received")
        
        return self.parse_response(run.id)
    
    def parse_response(self, run_id):
        """
        {
            "id": "msg_abc123",
            "object": "thread.message",
            "created_at": 1699017614,
            "assistant_id": null,
            "thread_id": "thread_abc123",
            "run_id": null,
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": {
                    "value": "How does AI work? Explain it in simple terms.",
                    "annotations": []
                }
                }
            ],
            "file_ids": [],
            "metadata": {
                "modified": "true",
                "user": "abc123"
            }
        }

        """
        tries = 3
        for i in range(tries):
            # Fetch the run status
            run_status = self.client.beta.threads.runs.retrieve(thread_id=self.thread.id, run_id=run_id)
            
            if run_status.status == "completed":
                break  # AI response is ready
            
            time.sleep(1)
        
        messages = self.client.beta.threads.messages.list(thread_id=self.thread.id)

        for msg in reversed(messages.data):  # Iterate from most recent
            if msg.role == "assistant":
                return msg.content[0].text.value  # Return AI's response

    

    def stream_message(self, instructions: str, event_handler: AssistantEventHandler):
        #streams assistant response - better if we want voice response
        
        #Taken from OpenAI - do not touch
        with self.client.beta.threads.runs.stream(
            thread_id=self.thread.id,
            assistant_id=self.assistant.id,
            instructions=instructions,
            event_handler=event_handler,
        ) as stream:
            stream.until_done()


#Taken from OpenAI - do not touch
class CustomEventHandler(AssistantEventHandler):
    """
    A custom event handler to process the streaming events from the assistant.
    """

    @override
    def on_text_created(self, text) -> None:
        print("\nassistant > ", end="", flush=True)

    @override
    def on_text_delta(self, delta, snapshot):
        print(delta.value, end="", flush=True)

    def on_tool_call_created(self, tool_call):
        print(f"\nassistant > {tool_call.type}\n", flush=True)

    def on_tool_call_delta(self, delta, snapshot):
        # Check for the code interpreter tool type events.
        if delta.type == "code_interpreter":
            if delta.code_interpreter.input:
                print(delta.code_interpreter.input, end="", flush=True)
            if delta.code_interpreter.outputs:
                print(f"\n\noutput >", flush=True)
                for output in delta.code_interpreter.outputs:
                    if output.type == "logs":
                        print(f"\n{output.logs}", flush=True)
