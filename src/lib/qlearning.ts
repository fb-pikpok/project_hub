import { Position, QTable, Action, QlearningParams, WarehouseConfig } from './types';

export class QLearningAgent {
  private qTable: QTable = {};
  private params: QlearningParams;
  private config: WarehouseConfig;

  constructor(config: WarehouseConfig, params: QlearningParams) {
    this.config = config;
    this.params = params;
    this.initializeQTable();
  }

  private initializeQTable(): void {
    // Initialize Q-table with zeros for all state-action pairs
    for (let x = 0; x < this.config.width; x++) {
      for (let y = 0; y < this.config.height; y++) {
        const state = this.positionToState({ x, y });
        this.qTable[state] = {
          up: 0,
          down: 0,
          left: 0,
          right: 0,
        };
      }
    }
  }

  private positionToState(position: Position): string {
    return `${position.x},${position.y}`;
  }

  private isValidPosition(position: Position): boolean {
    // Check bounds
    if (position.x < 0 || position.x >= this.config.width || 
        position.y < 0 || position.y >= this.config.height) {
      return false;
    }

    // Check obstacles
    return !this.config.obstacles.some(
      obstacle => obstacle.x === position.x && obstacle.y === position.y
    );
  }

  private getNextPosition(position: Position, action: Action): Position {
    const moves = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };

    const move = moves[action];
    return {
      x: position.x + move.x,
      y: position.y + move.y,
    };
  }

  private getReward(position: Position): number {
    // Goal reached: high positive reward
    if (position.x === this.config.goal.x && position.y === this.config.goal.y) {
      return 100;
    }

    // Small negative reward for each step to encourage efficiency
    return -1;
  }

  private isGoalReached(position: Position): boolean {
    return position.x === this.config.goal.x && position.y === this.config.goal.y;
  }

  public chooseAction(position: Position): Action {
    const state = this.positionToState(position);
    const actions: Action[] = ['up', 'down', 'left', 'right'];

    // Epsilon-greedy action selection
    if (Math.random() < this.params.explorationRate) {
      // Exploration: random action
      return actions[Math.floor(Math.random() * actions.length)];
    } else {
      // Exploitation: best action based on Q-table
      const qValues = this.qTable[state];
      let bestAction: Action = 'up';
      let bestValue = qValues[bestAction];

      for (const action of actions) {
        if (qValues[action] > bestValue) {
          bestValue = qValues[action];
          bestAction = action;
        }
      }

      return bestAction;
    }
  }

  public takeAction(currentPosition: Position, action: Action): {
    newPosition: Position;
    reward: number;
    done: boolean;
  } {
    const nextPosition = this.getNextPosition(currentPosition, action);
    
    // If next position is invalid, stay in current position
    const actualNextPosition = this.isValidPosition(nextPosition) 
      ? nextPosition 
      : currentPosition;

    const reward = this.getReward(actualNextPosition);
    const done = this.isGoalReached(actualNextPosition);

    // Update Q-table
    this.updateQTable(currentPosition, action, reward, actualNextPosition);

    return {
      newPosition: actualNextPosition,
      reward,
      done,
    };
  }

  private updateQTable(
    currentPosition: Position,
    action: Action,
    reward: number,
    nextPosition: Position
  ): void {
    const currentState = this.positionToState(currentPosition);
    const nextState = this.positionToState(nextPosition);

    // Get max Q-value for next state
    const nextQValues = this.qTable[nextState];
    const maxNextQ = Math.max(...Object.values(nextQValues));

    // Q-learning update rule
    const currentQ = this.qTable[currentState][action];
    const newQ = currentQ + this.params.learningRate * 
      (reward + this.params.discountFactor * maxNextQ - currentQ);

    this.qTable[currentState][action] = newQ;
  }

  public decayExploration(): void {
    this.params.explorationRate = Math.max(
      this.params.minExplorationRate,
      this.params.explorationRate * this.params.explorationDecay
    );
  }

  public getQTable(): QTable {
    return { ...this.qTable };
  }

  public getExplorationRate(): number {
    return this.params.explorationRate;
  }
}