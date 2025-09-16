// Types for the Q-learning warehouse demo

export interface Position {
  x: number;
  y: number;
}

export interface GridCell {
  type: 'empty' | 'obstacle' | 'start' | 'goal';
  position: Position;
}

export interface WarehouseConfig {
  width: number;
  height: number;
  obstacles: Position[];
  start: Position;
  goal: Position;
}

export interface QTable {
  [state: string]: {
    [action: string]: number;
  };
}

export interface Agent {
  position: Position;
  previousPosition: Position;
}

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  speed: number; // milliseconds between steps
  episode: number;
  step: number;
  totalReward: number;
}

export type Action = 'up' | 'down' | 'left' | 'right';

export interface QlearningParams {
  learningRate: number; // alpha
  discountFactor: number; // gamma
  explorationRate: number; // epsilon
  minExplorationRate: number;
  explorationDecay: number;
}