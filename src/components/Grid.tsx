import React from 'react';
import { GridCell } from './types';
import { CladdingVisualizer } from './CladdingVisualizer';

interface GridProps {
  grid: GridCell[][];
  onToggleCell: (row: number, col: number) => void;
  onToggleCladding: (row: number, col: number, edge: 'top' | 'right' | 'bottom' | 'left') => void;
}

export const Grid: React.FC<GridProps> = ({ grid, onToggleCell, onToggleCladding }) => {
  return (
    <div className="relative grid grid-cols-3 gap-1 bg-gray-100 p-4 rounded-lg">
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
          >
            {cell.hasCube && (
              <CladdingVisualizer
                cell={cell}
                onToggle={(edge) => onToggleCladding(rowIndex, colIndex, edge)}
                isEdgeExposed={{
                  top: !grid[rowIndex - 1]?.[colIndex]?.hasCube,
                  right: !grid[rowIndex]?.[colIndex + 1]?.hasCube,
                  bottom: !grid[rowIndex + 1]?.[colIndex]?.hasCube,
                  left: !grid[rowIndex]?.[colIndex - 1]?.hasCube
                }}
              />
            )}
          </div>
        ))
      ))}
    </div>
  );
};