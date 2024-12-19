import { GameService } from './services/game.service';
import { OpenAIService } from './services/openai.service';
import { AppError } from './errors/app_error';
import { validateNewGameRequest, validateGameAction } from './utils/validation';

const gameService = new GameService(new OpenAIService());

// Error response helper
function errorResponse(error: Error): Response {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const errorBody = {
    error: {
      message: error.message,
      code: error instanceof AppError ? error.code : 'INTERNAL_SERVER_ERROR'
    }
  };

  return Response.json(errorBody, {
    status: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}

const server = Bun.serve({
  port: 3000,
  async fetch(req: Request) {
    const url = new URL(req.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route handling
    try {
      // Start new game
      if (url.pathname === '/api/game/start' && req.method === 'POST') {
        const body = await req.json();
        const validatedData = validateNewGameRequest(body);
        const response = await gameService.startNewGame(validatedData.theme);
        return Response.json(response, { headers: corsHeaders });
      }

      // Process player action
      if (url.pathname === '/api/game/action' && req.method === 'POST') {
        const body = await req.json();
        const validatedData = validateGameAction(body);
        const { threadId, decision, health, items, situation } = validatedData;
        const gameState = { threadId, health, items, situation };
        const response = await gameService.processPlayerDecision(gameState, decision);
        return Response.json(response, { headers: corsHeaders });
      }

      // Recover game state
      if (url.pathname === '/api/game/recover-state' && req.method === 'POST') {
        const body = await req.json();
        const validatedData = validateGameAction(body);
        const { threadId, decision, health, items, situation } = validatedData;
        const gameState = { threadId, health, items, situation };
        const response = await gameService.recoverState(gameState, decision);
        return Response.json(response, { headers: corsHeaders });
      }

      if (url.pathname.startsWith('/api/game/history/') && req.method === 'GET') {
        const threadId = url.pathname.split('/').pop();
        if (!threadId) {
          throw new AppError('Thread ID is required', 400, 'BAD_REQUEST');
        }
        const messages = await gameService.getGameHistory(threadId);
        return Response.json(messages, { headers: corsHeaders });
      }

      // Handle 404
      throw new AppError('Endpoint not found', 404, 'NOT_FOUND');
    } catch (error) {
      console.error('Error processing request:', error);
      return errorResponse(error);
    }
  }
});

console.log(`Listening on http://localhost:${server.port}`);
