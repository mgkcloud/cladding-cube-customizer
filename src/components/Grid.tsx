import React, { useState } from 'react';
import { GridCell } from './types';
import { CladdingVisualizer } from './CladdingVisualizer';
import { hasAdjacentCube } from '@/utils/calculationUtils';

interface GridProps {
  grid: GridCell[][];
  onToggleCell: (row: number, col: number) => void;
  onToggleCladding: (row: number, col: number, edge: 'top' | 'right' | 'bottom' | 'left') => void;
}

export const Grid: React.FC<GridProps> = ({ grid, onToggleCell, onToggleCladding }) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setHasInteracted(true);
    onToggleCell(rowIndex, colIndex);
  };

  const handleOverlayClick = () => {
    setHasInteracted(true);
    // Place a cube in the middle cell (1,1) of the 3x3 grid
    onToggleCell(1, 1);
  };

  const handleCladdingToggle = (row: number, col: number, edge: 'top' | 'right' | 'bottom' | 'left') => {
    onToggleCladding(row, col, edge);
  };

  return (
    <div className="relative grid grid-cols-3 gap-1 bg-gray-100 p-4 rounded-lg">
      {!hasInteracted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded-lg cursor-pointer"
             onClick={handleOverlayClick}>
          <div className="bg-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold">
            Tap grid to place Foodcube
          </div>
        </div>
      )}
      {grid.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div 
            key={`${rowIndex}-${colIndex}`}
            data-testid="grid-cell"
            className={`
              relative aspect-square cursor-pointer
              ${cell.hasCube 
                ? 'bg-cover bg-center bg-no-repeat hover:brightness-90' 
                : 'bg-white hover:bg-gray-200'
              }
              border-2 border-gray-300 rounded
              transition-all duration-200
            `}
            style={{
              backgroundImage: cell.hasCube 
                ? 'url("https://foodcube.myshopify.com/cdn/shop/files/1_Top_View_-_Foodcube.png?v=1736309048&width=1206")'
                : 'none'
            }}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell.hasCube && (
              <CladdingVisualizer
                cell={cell}
                onToggle={(edge) => handleCladdingToggle(rowIndex, colIndex, edge)}
                isEdgeExposed={{
                  top: !hasAdjacentCube(grid, rowIndex, colIndex, 'top'),
                  right: !hasAdjacentCube(grid, rowIndex, colIndex, 'right'),
                  bottom: !hasAdjacentCube(grid, rowIndex, colIndex, 'bottom'),
                  left: !hasAdjacentCube(grid, rowIndex, colIndex, 'left')
                }}
              />
            )}
          </div>
        ))
      ))}
    </div>
  );
};