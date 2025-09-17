'use client';

import React, { useRef, useEffect, useState } from 'react';
import { EpisodeResult } from '@/lib/types';

interface PerformanceChartProps {
  episodeHistory: EpisodeResult[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  episodeHistory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 320, height: 240 });

  // Update dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Use most of the available width but maintain aspect ratio
        const width = Math.max(250, rect.width - 20); // Min 250px, leave some padding
        const height = Math.max(150, width * 0.6); // Maintain ~5:3 aspect ratio
        setDimensions({ width, height });
      }
    };

    updateDimensions();

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // If no data, show placeholder
    if (episodeHistory.length === 0) {
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No episode data yet', dimensions.width / 2, dimensions.height / 2);
      return;
    }

    // Chart margins - scale with size
    const margin = {
      top: Math.max(15, dimensions.height * 0.08),
      right: Math.max(15, dimensions.width * 0.05),
      bottom: Math.max(30, dimensions.height * 0.15),
      left: Math.max(40, dimensions.width * 0.12)
    };
    const chartWidth = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

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

    // Vertical grid lines - adaptive based on number of episodes
    const numGridLines = Math.min(10, Math.max(5, episodeHistory.length));
    const gridSpacing = Math.max(1, Math.floor(episodeHistory.length / numGridLines));
    for (let i = 0; i < episodeHistory.length; i += gridSpacing) {
      const x = margin.left + (chartWidth * i) / Math.max(1, episodeHistory.length - 1);
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
    
    // X-axis labels - show episode numbers at key points
    ctx.textAlign = 'center';
    if (episodeHistory.length > 1) {
      // Show episode numbers at strategic points
      const labelPositions = [0, Math.floor(episodeHistory.length / 4), Math.floor(episodeHistory.length / 2), Math.floor(3 * episodeHistory.length / 4), episodeHistory.length - 1];
      
      for (const pos of labelPositions) {
        if (pos < episodeHistory.length) {
          const x = margin.left + (chartWidth * pos) / Math.max(1, episodeHistory.length - 1);
          const episode = episodeHistory[pos].episode;
          ctx.fillText(episode.toString(), x, margin.top + chartHeight + 15);
        }
      }
    }
    
    // X-axis label
    ctx.fillText('Episodes', dimensions.width / 2, dimensions.height - 5);
    
    // Y-axis label
    ctx.save();
    ctx.translate(15, dimensions.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Steps', 0, 0);
    ctx.restore();

    // Draw data line
    if (episodeHistory.length > 1) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.beginPath();

      episodeHistory.forEach((episode, index) => {
        const x = margin.left + (chartWidth * index) / Math.max(1, episodeHistory.length - 1);
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
      const x = margin.left + (chartWidth * index) / Math.max(1, episodeHistory.length - 1);
      const y = margin.top + chartHeight - ((episode.steps - minSteps) / stepRange) * chartHeight;
      
      // Different colors for success/failure
      ctx.fillStyle = episode.success ? '#10B981' : '#EF4444';
      ctx.beginPath();
      
      // Adjust point size based on density - smaller points for more episodes
      const pointSize = episodeHistory.length > 100 ? 2 : episodeHistory.length > 50 ? 2.5 : 3;
      ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
      ctx.fill();
      
      // Highlight the latest episode
      if (index === episodeHistory.length - 1) {
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, pointSize + 2, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

  }, [episodeHistory, dimensions]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border border-gray-100 rounded w-full"
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