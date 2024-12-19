export type MessageContent = {
  health: number;
  items: string[];
  situation: string;
  decision: string;
  stateRecovery?: string;
};

export type ZorkMessage = {
  items: string[];
  reply?: string;
  decision?: string;
  damage?: number;
  health?: number;
  context?: string;
  situation?: string;
  score?: number;
  progress?: string;
};

export type GameState = {
  threadId: string;
  health: number;
  items: string[];
  situation: string;
  score?: number;
  progress?: string;
};

export type NewGameResponse = {
  threadId: string;
  introduction: ZorkMessage[];
};

export type CardData = {
  id: number;
  src: string;
  title: string;
  description: string;
  theme: string;
};
