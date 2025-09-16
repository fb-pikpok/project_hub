import { WarehouseConfig, QlearningParams } from './types';

export const DEFAULT_WAREHOUSE_CONFIG: WarehouseConfig = {
  width: 15,
  height: 15,
  start: { x: 1, y: 1 },
  goal: { x: 13, y: 13 },
  obstacles: [
    // Create some interesting obstacles
    // Vertical wall
    { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 },
    { x: 5, y: 6 }, { x: 5, y: 7 },
    
    // Horizontal wall
    { x: 8, y: 8 }, { x: 9, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 },
    
    // L-shaped obstacle
    { x: 2, y: 10 }, { x: 3, y: 10 }, { x: 4, y: 10 },
    { x: 4, y: 11 }, { x: 4, y: 12 },
    
    // Small obstacles
    { x: 12, y: 3 }, { x: 12, y: 4 },
    { x: 8, y: 2 }, { x: 9, y: 2 },
    { x: 1, y: 6 }, { x: 2, y: 6 },
    
    // Corner obstacles
    { x: 11, y: 11 }, { x: 12, y: 11 }, { x: 11, y: 12 },
  ],
};

export const DEFAULT_QLEARNING_PARAMS: QlearningParams = {
  learningRate: 0.1,
  discountFactor: 0.95,
  explorationRate: 1.0,
  minExplorationRate: 0.01,
  explorationDecay: 0.995,
};