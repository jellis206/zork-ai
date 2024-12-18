import { OpenAI } from 'openai';
import { ZorkMessage } from '@zork-ai/core';
import { AppError } from '../errors/app_error';

export class OpenAIService {
  private openai: OpenAI;
  private assistantId: string;

  constructor() {
    const apiKey = process.env.OPEN_AI_KEY;
    if (!apiKey) {
      throw new AppError('OpenAI API key not found', 500, 'MISSING_API_KEY');
    }

    this.openai = new OpenAI({ apiKey });
    this.assistantId = process.env.ASSISTANT_ID;

    if (!this.assistantId) {
      throw new AppError('Assistant ID not found', 500, 'MISSING_ASSISTANT_ID');
    }
  }

  async createThread(): Promise<string> {
    try {
      const thread = await this.openai.beta.threads.create();
      return thread.id;
    } catch (error) {
      console.log(error);
      throw new AppError('Failed to create thread', 500, 'OPENAI_THREAD_CREATION_FAILED');
    }
  }

  async deleteThread(threadId: string): Promise<void> {
    try {
      await this.openai.beta.threads.del(threadId);
    } catch (error) {
      console.log(error);
      throw new AppError('Failed to delete thread', 500, 'OPENAI_THREAD_DELETION_FAILED');
    }
  }

  async sendMessage(threadId: string, message: object): Promise<ZorkMessage[]> {
    try {
      const content = JSON.stringify(message);
      await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content
      });

      const run = await this.openai.beta.threads.runs.create(threadId, {
        assistant_id: this.assistantId
      });

      const response = await this.waitForResponse(threadId, run.id);
      if (!response) {
        throw new AppError('Failed to get response from OpenAI', 500, 'OPENAI_RESPONSE_FAILED');
      }

      return response;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to process message', 500, 'OPENAI_MESSAGE_PROCESSING_FAILED');
    }
  }

  private async waitForResponse(threadId: string, runId: string): Promise<ZorkMessage[] | null> {
    const maxAttempts = 10;
    const delayMs = 2000;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      try {
        const runStatus = await this.openai.beta.threads.runs.retrieve(threadId, runId);

        if (runStatus.status === 'completed') {
          const messagePage = await this.openai.beta.threads.messages.list(threadId);
          const firstMessage = messagePage.data[0];
          const message = await this.openai.beta.threads.messages.retrieve(
            threadId,
            firstMessage.id
          );
          const parsed = JSON.parse(JSON.stringify(message.content));
          return parsed.map((c: { text: { value: string } }) => JSON.parse(c.text.value));
        }

        if (runStatus.status === 'failed') {
          throw new AppError('OpenAI run failed', 500, 'OPENAI_RUN_FAILED');
        }

        if (runStatus.status === 'expired') {
          throw new AppError('OpenAI run expired', 500, 'OPENAI_RUN_EXPIRED');
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to check run status', 500, 'OPENAI_STATUS_CHECK_FAILED');
      }
    }

    throw new AppError('Response timeout', 504, 'OPENAI_RESPONSE_TIMEOUT');
  }
}
