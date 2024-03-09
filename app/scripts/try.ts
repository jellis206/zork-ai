import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

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

const assistant = await openai.beta.assistants.retrieve(assistantId);

// Create a thread
const thread = await openai.beta.threads.create();

const content = JSON.stringify({
  health: 100,
  situation: 'Player is standing in front of a large white house. There is a mailbox there.',
  items: [],
  player_decision: 'I want to open the mailbox.',
});

// Add a message to the thread
await openai.beta.threads.messages.create(thread.id, {
  role: 'user',
  content,
});

// Create a run
const run = await openai.beta.threads.runs.create(thread.id, { assistant_id: assistant.id });

console.log(run);

// See: Step 5 of assistants API page on the openai docs
for (let attempts = 0; attempts < 100; attempts++) {
  // Check run status
  const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
  if (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
    console.log(`Run status: ${runStatus.status}`);
  } else {
    console.log(runStatus);

    // Display Assistant's response
    const messagePage = await openai.beta.threads.messages.list(thread.id);

    const firstMessage = messagePage.data[0];
    const message = await openai.beta.threads.messages.retrieve(thread.id, firstMessage.id);
    console.log(message.content);

    break;
  }
}
