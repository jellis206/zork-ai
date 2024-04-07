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
      situation: 'start game: ' + (theme ?? DEFAULT_THEME),
      player_decision: ''
    };
    const introduction = await this.zorkAI.sendMessage(threadId, message);
    return { newThreadId: threadId, introduction };
  }

  public async postUserDecision(
    threadId: string,
    player_decision: string,
    health: number,
    items: string[],
    situation: string
  ): Promise<ZorkMessage[]> {
    const message = {
      player_decision,
      health,
      items,
      situation
    };
    return await this.zorkAI.sendMessage(threadId, message);
  }

  public async getThread(threadId: string): Promise<ZorkMessage[][]> {
    const thread = await this.zorkAI.getMessages(threadId);
    console.log(thread);
    return thread;
  }

  public async startNewThread(): Promise<string> {
    return await this.zorkAI.startNewThread();
  }
}
