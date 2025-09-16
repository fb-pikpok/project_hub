'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Position, WarehouseConfig, Agent } from '@/lib/types';

interface WarehouseCanvasProps {
  config: WarehouseConfig;
  agent: Agent;
}

export const WarehouseCanvas: React.FC<WarehouseCanvasProps> = ({
  config,
  agent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  // Update dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Make it square and leave some padding
        const size = Math.min(rect.width - 40, 600); // Max 600px, min container width minus padding
        setDimensions({ width: size, height: size });
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

  const cellWidth = dimensions.width / config.width;
  const cellHeight = dimensions.height / config.height;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw grid
    drawGrid(ctx);
    
    // Draw obstacles
    drawObstacles(ctx);
    
    // Draw start position
    drawStart(ctx);
    
    // Draw goal
    drawGoal(ctx);
    
    // Draw agent
    drawAgent(ctx);

  }, [config, agent, dimensions, cellWidth, cellHeight]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= config.width; x++) {
      const xPos = x * cellWidth;
      ctx.beginPath();
      ctx.moveTo(xPos, 0);
      ctx.lineTo(xPos, dimensions.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= config.height; y++) {
      const yPos = y * cellHeight;
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(dimensions.width, yPos);
      ctx.stroke();
    }
  };

  const drawObstacles = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#374151';
    
    config.obstacles.forEach((obstacle) => {
      const x = obstacle.x * cellWidth;
      const y = obstacle.y * cellHeight;
      ctx.fillRect(x + 1, y + 1, cellWidth - 2, cellHeight - 2);
    });
  };

  const drawStart = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#10b981';
    const x = config.start.x * cellWidth;
    const y = config.start.y * cellHeight;
    
    // Draw a circle for start position
    ctx.beginPath();
    ctx.arc(
      x + cellWidth / 2,
      y + cellHeight / 2,
      Math.min(cellWidth, cellHeight) / 3,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };

  const drawGoal = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ef4444';
    const x = config.goal.x * cellWidth;
    const y = config.goal.y * cellHeight;
    
    // Draw a star-like shape for goal
    ctx.fillRect(
      x + cellWidth / 4,
      y + cellHeight / 4,
      cellWidth / 2,
      cellHeight / 2
    );
  };

  const drawAgent = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#3b82f6';
    const x = agent.position.x * cellWidth;
    const y = agent.position.y * cellHeight;
    
    // Draw agent as a blue circle
    ctx.beginPath();
    ctx.arc(
      x + cellWidth / 2,
      y + cellHeight / 2,
      Math.min(cellWidth, cellHeight) / 4,
      0,
      2 * Math.PI
    );
    ctx.fill();
    
    // Add a white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border border-gray-300 rounded-lg shadow-sm"
      />
    </div>
  );
};