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
    # First, check if there are any active runs
        runs = self.client.beta.threads.runs.list(thread_id=self.thread.id)
        
        # Cancel any active runs
        for run in runs.data:
            if run.status in ["queued", "in_progress"]:
                try:
                    self.client.beta.threads.runs.cancel(
                        thread_id=self.thread.id,
                        run_id=run.id
                    )
                except Exception as e:
                    print(f"Error cancelling run {run.id}: {e}")
                    # Wait a moment for the run to complete naturally
                    time.sleep(1)
        
        # Now send the new message
        try:
            response = self.client.beta.threads.messages.create(
                thread_id=self.thread.id,
                role="user",
                content=message,
            )
            
            run = self.client.beta.threads.runs.create(
                thread_id=self.thread.id,
                assistant_id=self.assistant.id
            )
            
            return self.parse_response(run.id)
            
        except Exception as e:
            print(f"Error in send_message: {e}")
            return None
    
    def parse_response(self, run_id):
        max_retries = 10  # Increase number of retries
        retry_delay = 1   # Initial delay in seconds
        
        for i in range(max_retries):
            try:
                run_status = self.client.beta.threads.runs.retrieve(
                    thread_id=self.thread.id,
                    run_id=run_id
                )
                
                if run_status.status == "completed":
                    # Get all messages after run completion
                    messages = self.client.beta.threads.messages.list(
                        thread_id=self.thread.id,
                        order="desc",  # Get newest first
                        limit=1  # We only need the latest message
                    )
                    
                    if messages.data:
                        latest_message = messages.data[0]
                        if latest_message.role == "assistant":
                            return latest_message.content[0].text.value
                    return None
                    
                elif run_status.status == "failed":
                    print(f"Run failed: {run_status.last_error}")
                    return None
                    
                elif run_status.status == "expired":
                    print("Run expired")
                    return None
                    
                # If still running, wait with exponential backoff
                time.sleep(retry_delay)
                retry_delay = min(retry_delay * 1.5, 5)  # Increase delay but cap at 5 seconds
                
            except Exception as e:
                print(f"Error in parse_response: {e}")
                time.sleep(retry_delay)
        
        print("Max retries reached waiting for response")
        return None

        

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
