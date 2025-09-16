import { QLearningAgent } from './qlearning';
import { Agent, SimulationState, WarehouseConfig, QlearningParams, LearningStats, EpisodeResult } from './types';

export class SimulationEngine {
  private agent: QLearningAgent;
  private currentAgent: Agent;
  private config: WarehouseConfig;
  private simulationState: SimulationState;
  private learningStats: LearningStats;
  private intervalId: NodeJS.Timeout | null = null;
  private earlyEpisodes: number[] = []; // Store first 10 successful episodes for comparison

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
    this.learningStats = {
      bestRun: null,
      recentAverage: 0,
      earlyAverage: 0,
      improvementTrend: 'learning',
      successfulRuns: 0,
      failedRuns: 0,
      recentSuccessfulEpisodes: [],
      episodeHistory: [],
    };
    this.earlyEpisodes = [];
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

    // Reset learning stats
    this.learningStats = {
      bestRun: null,
      recentAverage: 0,
      earlyAverage: 0,
      improvementTrend: 'learning',
      successfulRuns: 0,
      failedRuns: 0,
      recentSuccessfulEpisodes: [],
      episodeHistory: [],
    };
    this.earlyEpisodes = [];

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
    const currentSteps = this.simulationState.step;
    const reachedGoal = this.currentAgent.position.x === this.config.goal.x &&
                       this.currentAgent.position.y === this.config.goal.y;
    
    // Update learning statistics
    this.updateLearningStats(currentSteps, reachedGoal);
    
    // Reset agent to start position
    this.currentAgent.position = { ...this.config.start };
    this.currentAgent.previousPosition = { ...this.config.start };
    
    // Update episode
    this.simulationState.episode++;
    this.simulationState.step = 0;
    
    // Decay exploration rate
    this.agent.decayExploration();
  }

  private updateLearningStats(steps: number, success: boolean): void {
    // Add to episode history (keep last 50 episodes for graphing)
    const episodeResult: EpisodeResult = {
      episode: this.simulationState.episode,
      steps,
      success,
    };
    
    this.learningStats.episodeHistory.push(episodeResult);
    if (this.learningStats.episodeHistory.length > 50) {
      this.learningStats.episodeHistory.shift();
    }
    
    if (success) {
      this.learningStats.successfulRuns++;
      
      // Update best run
      if (!this.learningStats.bestRun || steps < this.learningStats.bestRun.steps) {
        this.learningStats.bestRun = {
          episode: this.simulationState.episode,
          steps,
          reward: this.simulationState.totalReward,
        };
      }
      
      // Track early episodes (first 10) for comparison
      if (this.earlyEpisodes.length < 10) {
        this.earlyEpisodes.push(steps);
        this.learningStats.earlyAverage = this.earlyEpisodes.reduce((a, b) => a + b, 0) / this.earlyEpisodes.length;
      }
      
      // Track recent successful episodes (last 10)
      this.learningStats.recentSuccessfulEpisodes.push(steps);
      if (this.learningStats.recentSuccessfulEpisodes.length > 10) {
        this.learningStats.recentSuccessfulEpisodes.shift();
      }
      
      // Calculate recent average
      if (this.learningStats.recentSuccessfulEpisodes.length > 0) {
        this.learningStats.recentAverage = this.learningStats.recentSuccessfulEpisodes.reduce((a, b) => a + b, 0) /
                                          this.learningStats.recentSuccessfulEpisodes.length;
      }
      
      // Determine improvement trend
      this.updateImprovementTrend();
    } else {
      this.learningStats.failedRuns++;
    }
  }

  private updateImprovementTrend(): void {
    // Need at least 5 recent episodes and some early episodes to compare
    if (this.learningStats.recentSuccessfulEpisodes.length < 5 || this.earlyEpisodes.length < 5) {
      this.learningStats.improvementTrend = 'learning';
      return;
    }
    
    const recentAvg = this.learningStats.recentAverage;
    const earlyAvg = this.learningStats.earlyAverage;
    const improvementRatio = (earlyAvg - recentAvg) / earlyAvg;
    
    if (improvementRatio > 0.15) {
      this.learningStats.improvementTrend = 'improving';
    } else if (improvementRatio < -0.15) {
      this.learningStats.improvementTrend = 'declining';
    } else {
      this.learningStats.improvementTrend = 'stable';
    }
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

  public getLearningStats(): LearningStats {
    return {
      ...this.learningStats,
      episodeHistory: [...this.learningStats.episodeHistory],
      recentSuccessfulEpisodes: [...this.learningStats.recentSuccessfulEpisodes]
    };
  }

  public cleanup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}