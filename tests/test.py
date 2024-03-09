from dotenv import load_dotenv
import openai
import os
import time

# Load environment variables from .env file in the parent directory
dotenv_path = "../.env"  # Adjust the path as needed
load_dotenv(dotenv_path)

# gets API Key from environment variable OPENAI_API_KEY
client = openai.OpenAI(api_key=os.getenv("OPEN_AI_KEY"))

assistant = client.beta.assistants.retrieve("asst_Lu4KMpnFn6Corjry9nweSm7u")

thread = client.beta.threads.create() # this creates a thread
# thread = client.beta.threads.retrieve("thread_lRW9PQIWX1SHN3pfIGZ1hzIt")

json_example = {
  "health": 100,
  "situation": "Player is standing in front of a large white house. There is a mailbox there.",
  "items": [],
  "player_decision": "I want to open the mailbox."
}

message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=f"{json_example}",
)
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id,
)

print("checking assistant status. ")
while True:
    time.sleep(2)
    run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

    if run.status == "completed":
        messages = client.beta.threads.messages.list(thread_id=thread.id)

        print("messages: ")
        for message in messages:
            assert message.content[0].type == "text"
            print({"role": message.role, "message": message.content[0].text.value})

        break
    elif run.status == "failed":
        print(run)
        break
    else:
        print(run.status)
        