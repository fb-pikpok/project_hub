'use client';

import React, { useRef, useEffect } from 'react';
import { EpisodeResult } from '@/lib/types';

interface PerformanceChartProps {
  episodeHistory: EpisodeResult[];
  width?: number;
  height?: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  episodeHistory,
  width = 400,
  height = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // If no data, show placeholder
    if (episodeHistory.length === 0) {
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No episode data yet', width / 2, height / 2);
      return;
    }

    // Chart margins
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Find data bounds
    const maxSteps = Math.max(...episodeHistory.map(ep => ep.steps));
    const minSteps = Math.min(...episodeHistory.map(ep => ep.steps));
    const stepRange = maxSteps - minSteps || 1;

    // Draw background
    ctx.fillStyle = '#F9FAFB';
    ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight);

    // Draw grid lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines
    const gridSpacing = Math.max(1, Math.floor(episodeHistory.length / 10));
    for (let i = 0; i < episodeHistory.length; i += gridSpacing) {
      const x = margin.left + (chartWidth * i) / (episodeHistory.length - 1 || 1);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + chartHeight);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = maxSteps - (stepRange * i) / 5;
      const y = margin.top + (chartHeight * i) / 5;
      ctx.fillText(Math.round(value).toString(), margin.left - 5, y + 4);
    }
    
    // X-axis label
    ctx.textAlign = 'center';
    ctx.fillText('Episodes', width / 2, height - 5);
    
    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Steps', 0, 0);
    ctx.restore();

    // Draw data line
    if (episodeHistory.length > 1) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.beginPath();

      episodeHistory.forEach((episode, index) => {
        const x = margin.left + (chartWidth * index) / (episodeHistory.length - 1);
        const y = margin.top + chartHeight - ((episode.steps - minSteps) / stepRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }

    // Draw data points
    episodeHistory.forEach((episode, index) => {
      const x = margin.left + (chartWidth * index) / (episodeHistory.length - 1 || 1);
      const y = margin.top + chartHeight - ((episode.steps - minSteps) / stepRange) * chartHeight;
      
      // Different colors for success/failure
      ctx.fillStyle = episode.success ? '#10B981' : '#EF4444';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      // Highlight the latest episode
      if (index === episodeHistory.length - 1) {
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

  }, [episodeHistory, width, height]);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Progress</h3>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-100 rounded"
      />
      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Success</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Failure</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-gray-800 rounded-full"></div>
          <span>Latest</span>
        </div>
      </div>
    </div>
  );
};