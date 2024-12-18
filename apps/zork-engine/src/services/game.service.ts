import { OpenAIService } from './openai.service';
import { ZorkMessage, GameState, NewGameResponse } from '@zork-ai/core';
import { AppError } from '../errors/app_error';

export class GameService {
  constructor(private openAIService: OpenAIService) {}

  async startNewGame(theme: string): Promise<NewGameResponse> {
    try {
      const threadId = await this.openAIService.createThread();

      // Validate initial game state
      if (!threadId) {
        throw new AppError('Failed to create game thread', 500, 'GAME_CREATION_FAILED');
      }

      const initialState = {
        health: 100,
        items: [],
        situation: `start game: ${theme}`,
        player_decision: ''
      };

      const introduction = await this.openAIService.sendMessage(threadId, initialState);

      if (!introduction || introduction.length === 0) {
        await this.cleanupFailedGame(threadId);
        throw new AppError('Failed to initialize game state', 500, 'GAME_INIT_FAILED');
      }

      return { threadId, introduction };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to start new game', 500, 'GAME_START_FAILED');
    }
  }

  async processPlayerDecision(gameState: GameState, decision: string): Promise<ZorkMessage[]> {
    try {
      // Validate game state
      this.validateGameState(gameState);

      const message = {
        player_decision: decision,
        health: gameState.health,
        items: gameState.items,
        situation: gameState.situation
      };

      const response = await this.openAIService.sendMessage(gameState.threadId, message);

      if (!response || response.length === 0) {
        throw new AppError('Invalid game response', 500, 'INVALID_GAME_RESPONSE');
      }

      // Process any damage from the response
      const totalDamage = response.reduce((sum, msg) => sum + (msg.damage || 0), 0);
      if (totalDamage > 0 && gameState.health - totalDamage <= 0) {
        await this.handleGameOver(gameState.threadId);
      }

      return response;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to process player decision', 500, 'DECISION_PROCESSING_FAILED');
    }
  }

  async endGame(threadId: string): Promise<void> {
    try {
      await this.openAIService.deleteThread(threadId);
    } catch (error) {
      console.error('Failed to cleanup game thread:', error);
      // Non-throwing error as this is cleanup
    }
  }

  private async cleanupFailedGame(threadId: string): Promise<void> {
    try {
      await this.openAIService.deleteThread(threadId);
    } catch (error) {
      console.error('Failed to cleanup failed game:', error);
    }
  }

  private async handleGameOver(threadId: string): Promise<void> {
    try {
      const gameOverMessage = {
        player_decision: 'GAME_OVER',
        health: 0,
        items: [],
        situation: 'game over'
      };

      await this.openAIService.sendMessage(threadId, gameOverMessage);
      // Optional: Add delay before cleaning up the thread
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await this.endGame(threadId);
    } catch (error) {
      console.error('Error handling game over:', error);
    }
  }

  private validateGameState(gameState: GameState): void {
    if (!gameState.threadId) {
      throw new AppError('Invalid thread ID', 400, 'INVALID_THREAD_ID');
    }

    if (typeof gameState.health !== 'number' || gameState.health < 0 || gameState.health > 100) {
      throw new AppError('Invalid health value', 400, 'INVALID_HEALTH');
    }

    if (!Array.isArray(gameState.items)) {
      throw new AppError('Invalid items array', 400, 'INVALID_ITEMS');
    }

    if (!gameState.situation) {
      throw new AppError('Invalid game situation', 400, 'INVALID_SITUATION');
    }
  }

  async getGameHistory(threadId: string): Promise<ZorkMessage[]> {
    try {
      if (!threadId) {
        throw new AppError('Thread ID is required', 400, 'INVALID_THREAD_ID');
      }

      // Get messages from OpenAI thread
      const messages = await this.openAIService.getThreadMessages(threadId);

      if (!messages) {
        throw new AppError('Failed to retrieve game history', 404, 'HISTORY_NOT_FOUND');
      }

      return messages.reverse();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to retrieve game history', 500, 'HISTORY_RETRIEVAL_FAILED');
    }
  }

  // Optional: Add method to retrieve partial game history
  /* async getRecentMessages(threadId: string, limit = 10): Promise<ZorkMessage[]> {
    try {
      const message = {
        player_decision: 'GET_HISTORY',
        health: 100,
        items: [],
        situation: 'history request'
      };

      return await this.openAIService.sendMessage(threadId, message);
    } catch (error) {
      console.log(error);
      throw new AppError('Failed to retrieve game history', 500, 'HISTORY_RETRIEVAL_FAILED');
    }
  }*/
}
