import { OpenAI } from 'openai';
import { Assistant } from 'openai/resources/beta/index.mjs';
import { ASSISTANT_ID } from '~/core/constants';
import { MessageContent } from '~/core/types';
import * as dotenv from 'dotenv';

export type ZorkMessage = {
  items: string[];
  reply?: string;
  player_decision?: string;
  damage?: number;
  health?: number;
  context?: string;
  situation?: string;
};

export class ZorkAI {
  private openai: OpenAI;
  private assistant: Assistant | null = null;

  constructor() {
    dotenv.config();
    const apiKey = process.env.OPEN_AI_KEY;
    if (!apiKey) {
      throw new Error('OPEN_AI_KEY environment variable not found');
    }

    const clientOptions = {
      apiKey
    };

    this.openai = new OpenAI(clientOptions);
  }

  public async setup() {
    await this.initAssistant();
  }

  public async initAssistant() {
    this.assistant = await this.openai.beta.assistants.retrieve(ASSISTANT_ID);
  }

  public async startNewThread(): Promise<string> {
    const thread = await this.openai.beta.threads.create();
    return thread.id;
  }

  public async deleteThread(threadId: string) {
    await this.openai.beta.threads.del(threadId);
  }

  public async sendMessage(threadId: string, message: MessageContent): Promise<ZorkMessage[]> {
    const content = JSON.stringify(message);
    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content
    });
    if (!this.assistant) {
      await this.initAssistant();
    }
    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistant?.id ?? ASSISTANT_ID
    });

    for (let attempts = 0; attempts < 10; attempts++) {
      // Check run status
      const runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      if (runStatus.status !== 'queued' && runStatus.status !== 'in_progress') {
        const messagePage = await this.openai.beta.threads.messages.list(threadId);
        const firstMessage = messagePage.data[0];
        const message = await this.openai.beta.threads.messages.retrieve(threadId, firstMessage.id);
        const m = JSON.parse(JSON.stringify(message.content));
        return m.map((c: OpenAiMessage) => JSON.parse(c.text.value) as ZorkMessage);
      }
    }
    throw new Error('Sorry, I am unable to respond at the moment. Please try again later.');
  }

  public async getMessages(threadId: string): Promise<ZorkMessage[][]> {
    const messagePage = await this.openai.beta.threads.messages.list(threadId);
    const messages = messagePage.data.map((message) => {
      const m = message.content.map((c) => JSON.parse(JSON.stringify(c)));
      return m.map((c: OpenAiMessage) => JSON.parse(c.text.value) as ZorkMessage);
    });
    return messages;
  }
}

type OpenAiMessage = {
  type: string;
  text: {
    value: string;
    annotations: string[];
  };
};
