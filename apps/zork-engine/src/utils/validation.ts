import { MessageContent } from '@zork-ai/core';
import { AppError } from '../errors/app_error';

export function validateNewGameRequest(data: unknown): { theme: string } {
  if (!data || typeof data !== 'object') {
    throw new AppError('Invalid request body', 400, 'INVALID_REQUEST');
  }

  // Type assertion with type guard
  const payload = data as Record<string, unknown>;
  const theme = payload.theme;

  // Explicitly check theme is string or undefined
  if (theme !== undefined && typeof theme !== 'string') {
    throw new AppError('Theme must be a string', 400, 'INVALID_THEME');
  }

  return { theme: (theme as string) || 'zork' };
}

export function validateGameAction(data: unknown): MessageContent & { threadId: string } {
  if (!data || typeof data !== 'object') {
    throw new AppError('Invalid request body', 400, 'INVALID_REQUEST');
  }

  const payload = data as Record<string, unknown>;
  const { threadId, decision, health, items, situation } = payload;

  // Validate each field with type guards
  if (!threadId || typeof threadId !== 'string') {
    throw new AppError('Thread ID is required and must be a string', 400, 'INVALID_THREAD_ID');
  }

  if (!decision || typeof decision !== 'string') {
    throw new AppError('Decision is required and must be a string', 400, 'INVALID_DECISION');
  }

  if (typeof health !== 'number' || health < 0 || health > 100) {
    throw new AppError('Health must be a number between 0 and 100', 400, 'INVALID_HEALTH');
  }

  if (!Array.isArray(items) || !items.every((item) => typeof item === 'string')) {
    throw new AppError('Items must be an array of strings', 400, 'INVALID_ITEMS');
  }

  if (!situation || typeof situation !== 'string') {
    throw new AppError('Situation is required and must be a string', 400, 'INVALID_SITUATION');
  }

  return { threadId, decision, health, items, situation };
}
