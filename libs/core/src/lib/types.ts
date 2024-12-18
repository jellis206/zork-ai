export type MessageContent = {
  health: number;
  items: string[];
  situation: string;
  player_decision: string;
};

export type ZorkMessage = {
  items: string[];
  reply?: string;
  player_decision?: string;
  damage?: number;
  health?: number;
  context?: string;
  situation?: string;
};

export type GameState = {
  threadId: string;
  health: number;
  items: string[];
  situation: string;
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
