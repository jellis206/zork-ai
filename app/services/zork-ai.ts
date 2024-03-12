import { OpenAI } from 'openai';
import { Assistant } from 'openai/resources/beta/index.mjs';
import { ASSISTANT_ID } from '~/core/constants';
import { MessageContent } from '~/core/types';
import * as dotenv from 'dotenv';

export class ZorkAI {
  private openai: OpenAI;
  private assistant: Assistant | null = null;
  private static _instance: ZorkAI;
  public static get instance(): ZorkAI {
    if (!ZorkAI._instance) {
      ZorkAI._instance = new ZorkAI();
    }
    return ZorkAI._instance;
  }

  private constructor() {
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

  public async sendMessage(threadId: string, message: MessageContent): Promise<string> {
    try {
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

      for (let attempts = 0; attempts < 5; attempts++) {
        // Check run status
        const runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
        if (runStatus.status !== 'queued' && runStatus.status !== 'in_progress') {
          const messagePage = await this.openai.beta.threads.messages.list(threadId);
          const firstMessage = messagePage.data[0];
          const message = await this.openai.beta.threads.messages.retrieve(
            threadId,
            firstMessage.id
          );
          return message.content.toString();
        }
      }
      return 'Sorry, I am unable to respond at the moment. Please try again later.';
    } catch (err) {
      console.error(err);
      return 'Something went wrong. Please try again.';
    }
  }

  public async getMessages(threadId: string): Promise<string[]> {
    const messagePage = await this.openai.beta.threads.messages.list(threadId);
    return messagePage.data.map((message) => message.content.toString());
  }
}
