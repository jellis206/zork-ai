import { ZorkAI, ZorkMessage } from './zork-ai';

const DEFAULT_THEME = 'zork';

export type NewGameMessage = {
  newThreadId: string;
  introduction: ZorkMessage[];
};

export default class ZorkEngine {
  private zorkAI: ZorkAI;
  constructor() {
    this.zorkAI = new ZorkAI();
  }

  public async startNewGame(threadId: string, theme: string): Promise<NewGameMessage> {
    const message = {
      health: 100,
      items: [],
      situation: theme ?? DEFAULT_THEME,
      player_decision: ''
    };
    const introduction = await this.zorkAI.sendMessage(threadId, message);
    return { newThreadId: threadId, introduction };
  }

  public async postUserDecision(
    threadId: string,
    decision: string,
    health: number,
    items: string[]
  ) {
    const message = {
      health,
      items,
      situation: DEFAULT_THEME,
      player_decision: decision
    };
    return await this.zorkAI.sendMessage(threadId, message);
  }

  public async getThread(threadId: string) {
    return await this.zorkAI.getMessages(threadId);
  }

  public async startNewThread(): Promise<string> {
    return await this.zorkAI.startNewThread();
  }
}
