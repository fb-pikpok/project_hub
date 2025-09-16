'use client';

import React from 'react';
import { SimulationState } from '@/lib/types';

interface WarehouseControlsProps {
  simulationState: SimulationState;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  explorationRate: number;
}

export const WarehouseControls: React.FC<WarehouseControlsProps> = ({
  simulationState,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  explorationRate,
}) => {
  const speedOptions = [
    { label: '0.5x', value: 400 },
    { label: '1x', value: 200 },
    { label: '2x', value: 100 },
    { label: '16x', value: 12 },
    { label: 'Max Speed', value: 1 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Controls</h3>
      
      <div className="space-y-6">
        {/* Play/Pause/Reset Controls */}
        <div className="flex gap-2 w-full">
          {!simulationState.isRunning ? (
            <button
              onClick={onPlay}
              className="flex-1 min-h-[2.5rem] bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
            >
              ▶ Play
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex-1 min-h-[2.5rem] bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm sm:text-base font-medium"
            >
              ⏸ Pause
            </button>
          )}
          
          <button
            onClick={onReset}
            className="flex-1 min-h-[2.5rem] bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
          >
            🔄 Reset
          </button>
        </div>

        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Simulation Speed
          </label>
          <select
            value={simulationState.speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {speedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Current Episode Statistics */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Current Episode</h4>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Episode</div>
              <div className="text-lg font-semibold text-gray-900">
                {simulationState.episode}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Steps</div>
              <div className="text-lg font-semibold text-gray-900">
                {simulationState.step}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Total Reward</div>
              <div className="text-lg font-semibold text-gray-900">
                {simulationState.totalReward.toFixed(1)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Exploration Rate</div>
              <div className="text-lg font-semibold text-gray-900">
                {(explorationRate * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};