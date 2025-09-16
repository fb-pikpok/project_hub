import { QLearningAgent } from './qlearning';
import { Agent, SimulationState, WarehouseConfig, QlearningParams } from './types';

export class SimulationEngine {
  private agent: QLearningAgent;
  private currentAgent: Agent;
  private config: WarehouseConfig;
  private simulationState: SimulationState;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(config: WarehouseConfig, params: QlearningParams) {
    this.config = config;
    this.agent = new QLearningAgent(config, params);
    this.currentAgent = {
      position: { ...config.start },
      previousPosition: { ...config.start },
    };
    this.simulationState = {
      isRunning: false,
      isPaused: false,
      speed: 200,
      episode: 1,
      step: 0,
      totalReward: 0,
    };
  }

  public start(onUpdate: (agent: Agent, state: SimulationState) => void): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.simulationState.isRunning = true;
    this.simulationState.isPaused = false;

    this.intervalId = setInterval(() => {
      this.step();
      onUpdate(this.getCurrentAgent(), this.getSimulationState());
    }, this.simulationState.speed);
  }

  public pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.simulationState.isRunning = false;
    this.simulationState.isPaused = true;
  }

  public reset(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.currentAgent = {
      position: { ...this.config.start },
      previousPosition: { ...this.config.start },
    };

    this.simulationState = {
      isRunning: false,
      isPaused: false,
      speed: this.simulationState.speed, // Keep current speed
      episode: 1,
      step: 0,
      totalReward: 0,
    };

    // Reset the Q-learning agent
    this.agent = new QLearningAgent(this.config, {
      learningRate: 0.1,
      discountFactor: 0.95,
      explorationRate: 1.0,
      minExplorationRate: 0.01,
      explorationDecay: 0.995,
    });
  }

  public setSpeed(speed: number, onUpdate?: (agent: Agent, state: SimulationState) => void): void {
    this.simulationState.speed = speed;
    
    // If running, restart with new speed
    if (this.simulationState.isRunning && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.step();
        if (onUpdate) {
          onUpdate(this.getCurrentAgent(), this.getSimulationState());
        }
      }, speed);
    }
  }

  private step(): void {
    // Choose action
    const action = this.agent.chooseAction(this.currentAgent.position);
    
    // Take action
    const result = this.agent.takeAction(this.currentAgent.position, action);
    
    // Update agent position
    this.currentAgent.previousPosition = { ...this.currentAgent.position };
    this.currentAgent.position = result.newPosition;
    
    // Update simulation state
    this.simulationState.step++;
    this.simulationState.totalReward += result.reward;
    
    // Check if episode is done
    if (result.done) {
      this.completeEpisode();
    }
    
    // Limit steps per episode to prevent infinite loops
    if (this.simulationState.step > 1000) {
      this.completeEpisode();
    }
  }

  private completeEpisode(): void {
    // Reset agent to start position
    this.currentAgent.position = { ...this.config.start };
    this.currentAgent.previousPosition = { ...this.config.start };
    
    // Update episode
    this.simulationState.episode++;
    this.simulationState.step = 0;
    
    // Decay exploration rate
    this.agent.decayExploration();
  }

  public getCurrentAgent(): Agent {
    return {
      position: { ...this.currentAgent.position },
      previousPosition: { ...this.currentAgent.previousPosition },
    };
  }

  public getSimulationState(): SimulationState {
    return { ...this.simulationState };
  }

  public getExplorationRate(): number {
    return this.agent.getExplorationRate();
  }

  public cleanup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}