import * as dotenv from 'dotenv';
import { OpenAI } from 'openai'; // Assuming you have an OpenAI library for TypeScript

// Load environment variables from .env file
dotenv.config({ path: '../.env' }); // Adjust the path as needed

// Get API key from environment variable
const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
if (!OPEN_AI_KEY) {
  throw new Error('OPEN_AI_KEY environment variable not found');
}

const clientOptions = {
  apiKey: OPEN_AI_KEY,
};

const openai = new OpenAI(clientOptions);

const assistantId = 'asst_Lu4KMpnFn6Corjry9nweSm7u';

async function main() {
  try {
    const assistant = await openai.beta.assistants.retrieve(assistantId);

    const thread = await openai.beta.threads.create();

    const jsonExample = {
      health: 100,
      situation: "Player is standing in front of a large white house. There is a mailbox there.",
      items: [],
      player_decision: "I want to open the mailbox.",
    };

    
    const threadMessages = await openai.beta.threads.messages.create(
      thread.id,
      { role: "user", content: JSON.stringify(jsonExample) }
    );
  
    console.log(threadMessages);

    let run = await openai.beta.threads.runs.create(
      thread.id,
      { assistant_id: assistant.id }
    );

    console.log("Checking assistant status...");

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

      run = await openai.beta.threads.runs.retrieve(thread.id, run.id);

      if (run.status === "completed") {
        const messages = await openai.beta.threads.messages.list(thread.id);

        console.log("Messages:");
        for (const message in messages) {
          if (message.content[0].type !== "text") {
            throw new Error("Unexpected message content type");
          }
          console.log({ role: message.role, message: message.content[0].text.value });
        }

        break;
      } else if (run.status === "failed") {
        console.error(run);
        break;
      } else {
        console.log(run.status);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
