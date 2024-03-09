import { ZorkAI } from './zork-ai';

const DEFAULT_THEME = 'zork';

export type NewGameMessage = {
  newThreadId: string;
  startMessage: string;
};

export default class ZorkEngine {
  private zorkAI = ZorkAI.instance;
  constructor(private threadId: string) {}

  public static async startNewGame(threadId: string, theme: string): Promise<NewGameMessage> {
    // delete old thread if threadId is not an empty string
    if (threadId) {
      await ZorkAI.instance.deleteThread(threadId);
    }
    threadId = await ZorkAI.instance.startNewThread();
    // set theme
    const message = {
      health: 100,
      items: [],
      situation: theme ?? DEFAULT_THEME,
      player_decision: ''
    };
    const startMessage = await ZorkAI.instance.sendMessage(threadId, message);
    return { newThreadId: threadId, startMessage };
  }

  public static async postUserDecision(threadId: string, decision: string) {
    const message = {
      health: 100,
      items: [],
      situation: DEFAULT_THEME,
      player_decision: decision
    };
    return await ZorkAI.instance.sendMessage(threadId, message);
  }

  public static async getThread(threadId: string) {
    return await ZorkAI.instance.getMessages(threadId);
  }
}
