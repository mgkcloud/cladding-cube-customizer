import React from 'react';
import { GridCell } from './types';

interface GridProps {
  grid: GridCell[][];
  onToggleCell: (row: number, col: number) => void;
  onToggleHeight: (row: number, col: number) => void;
}

export const Grid: React.FC<GridProps> = ({ grid, onToggleCell, onToggleHeight }) => {
  return (
    <div className="grid grid-cols-3 gap-1 bg-gray-100 p-4 rounded-lg">
      {grid.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div 
            key={`${rowIndex}-${colIndex}`}
            className={`
              relative aspect-square cursor-pointer
              ${cell.hasCube 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-white hover:bg-gray-200'
              }
              border-2 border-gray-300 rounded
              transition-colors duration-200
            `}
            onClick={() => onToggleCell(rowIndex, colIndex)}
            onContextMenu={(e) => {
              e.preventDefault();
              onToggleHeight(rowIndex, colIndex);
            }}
          >
            {cell.hasCube && cell.isExtraTall && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
            )}
          </div>
        ))
      ))}
    </div>
  );
};