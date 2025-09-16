'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { WarehouseCanvas } from '@/components/WarehouseCanvas';
import { WarehouseControls } from '@/components/WarehouseControls';
import { SimulationEngine } from '@/lib/simulation-engine';
import { DEFAULT_WAREHOUSE_CONFIG, DEFAULT_QLEARNING_PARAMS } from '@/lib/warehouse-config';
import { Agent, SimulationState } from '@/lib/types';

export default function WarehousePage() {
  const [agent, setAgent] = useState<Agent>({
    position: { ...DEFAULT_WAREHOUSE_CONFIG.start },
    previousPosition: { ...DEFAULT_WAREHOUSE_CONFIG.start },
  });
  
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    isPaused: false,
    speed: 200,
    episode: 1,
    step: 0,
    totalReward: 0,
  });

  const [explorationRate, setExplorationRate] = useState<number>(1.0);
  const simulationEngineRef = useRef<SimulationEngine | null>(null);
  const updateCallbackRef = useRef<((agent: Agent, state: SimulationState) => void) | null>(null);

  // Initialize simulation engine
  useEffect(() => {
    simulationEngineRef.current = new SimulationEngine(
      DEFAULT_WAREHOUSE_CONFIG,
      DEFAULT_QLEARNING_PARAMS
    );

    return () => {
      if (simulationEngineRef.current) {
        simulationEngineRef.current.cleanup();
      }
    };
  }, []);

  const handlePlay = () => {
    if (simulationEngineRef.current) {
      const updateCallback = (newAgent: Agent, newState: SimulationState) => {
        setAgent(newAgent);
        setSimulationState(newState);
        setExplorationRate(simulationEngineRef.current!.getExplorationRate());
      };
      updateCallbackRef.current = updateCallback;
      simulationEngineRef.current.start(updateCallback);
    }
  };

  const handlePause = () => {
    if (simulationEngineRef.current) {
      simulationEngineRef.current.pause();
      setSimulationState(prev => ({ 
        ...prev, 
        isRunning: false, 
        isPaused: true 
      }));
    }
  };

  const handleReset = () => {
    if (simulationEngineRef.current) {
      simulationEngineRef.current.reset();
      setAgent({
        position: { ...DEFAULT_WAREHOUSE_CONFIG.start },
        previousPosition: { ...DEFAULT_WAREHOUSE_CONFIG.start },
      });
      setSimulationState({
        isRunning: false,
        isPaused: false,
        speed: 200,
        episode: 1,
        step: 0,
        totalReward: 0,
      });
      setExplorationRate(1.0);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (simulationEngineRef.current) {
      simulationEngineRef.current.setSpeed(speed, updateCallbackRef.current || undefined);
      setSimulationState(prev => ({ ...prev, speed }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Hub
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Warehouse Q-Learning Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Watch an AI agent learn to navigate through a warehouse using Q-learning reinforcement learning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Warehouse Environment
              </h2>
              <div className="flex justify-center">
                <WarehouseCanvas
                  config={DEFAULT_WAREHOUSE_CONFIG}
                  agent={agent}
                  width={600}
                  height={600}
                />
              </div>
              
              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  <span>Agent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500"></div>
                  <span>Goal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700"></div>
                  <span>Obstacles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Area */}
          <div className="lg:col-span-1">
            <WarehouseControls
              simulationState={simulationState}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onSpeedChange={handleSpeedChange}
              explorationRate={explorationRate}
            />
            
            {/* Information Panel */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How Q-Learning Works
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Exploration vs Exploitation:</strong> The agent starts by exploring randomly (100% exploration rate), then gradually learns to exploit better paths as the exploration rate decreases.
                </p>
                <p>
                  <strong>Rewards:</strong> The agent gets +100 for reaching the goal and -1 for each step, encouraging efficient navigation.
                </p>
                <p>
                  <strong>Learning:</strong> Each action updates the Q-table, which stores the expected future rewards for each state-action pair.
                </p>
                <p>
                  <strong>Episodes:</strong> When the agent reaches the goal or takes too many steps, a new episode begins from the start position.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}