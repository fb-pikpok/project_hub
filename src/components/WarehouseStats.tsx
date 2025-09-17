'use client';

import React from 'react';
import { LearningStats } from '@/lib/types';

interface WarehouseStatsProps {
  learningStats: LearningStats;
}

export const WarehouseStats: React.FC<WarehouseStatsProps> = ({
  learningStats,
}) => {
  return (
    <div className="space-y-6">
      {/* Best Run */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
        
        {learningStats.bestRun ? (
          <div className="bg-green-50 p-4 rounded-md">
            <div className="text-sm font-medium text-green-800">🏆 Best Run</div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              {learningStats.bestRun.steps} steps
            </div>
            <div className="text-sm text-green-700 mt-1">
              Episode {learningStats.bestRun.episode} • Reward: {learningStats.bestRun.reward.toFixed(1)}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-600">🏆 Best Run</div>
            <div className="text-lg text-gray-500 mt-1">
              No successful episodes yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
};