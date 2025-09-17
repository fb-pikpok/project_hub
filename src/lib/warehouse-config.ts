import { WarehouseConfig, QlearningParams } from './types';

export const DEFAULT_WAREHOUSE_CONFIG: WarehouseConfig = {
  width: 10,
  height: 10,
  start: { x: 1, y: 1 },
  goal: { x: 8, y: 8 },
  obstacles: [
    // Create some interesting obstacles
    // Vertical wall
    { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 },
    
    // Horizontal wall
    { x: 6, y: 6 }, { x: 7, y: 6 },
    
    // L-shaped obstacle
    { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 3, y: 8 },
    
    // Small obstacles
    { x: 7, y: 2 }, { x: 8, y: 2 },
    { x: 1, y: 5 }, { x: 2, y: 5 },
    
    // Corner obstacles
    { x: 6, y: 8 }, { x: 7, y: 7 },
  ],
};

export const DEFAULT_QLEARNING_PARAMS: QlearningParams = {
  learningRate: 0.1,
  discountFactor: 0.95,
  explorationRate: 1.0,
  minExplorationRate: 0.01,
  explorationDecay: 0.995,
};