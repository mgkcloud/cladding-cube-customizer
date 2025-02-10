import React from 'react';
import { GridCell } from './types';
import { validateIrrigationPath } from '@/utils/connectionValidator';
import { hasAdjacentCube } from '@/utils/calculationUtils';

interface PipelineVisualizerProps {
  cell: GridCell;
  row: number;
  col: number;
  grid: GridCell[][];
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  cell,
  row,
  col,
  grid,
}) => {
  // Get irrigation path for visualization
  const paths = validateIrrigationPath(grid);
  const currentPath = paths.find(path => 
    path.cubes.some(cube => cube.row === row && cube.col === col)
  );
  
  // Find current cube in path
  const currentCube = currentPath?.cubes.find(cube => cube.row === row && cube.col === col);
  
  if (!currentCube) {
    return null;
  }

  // Determine if this cube has valid connections
  const hasValidEntry = currentCube.connections?.entry && hasAdjacentCube(grid, row, col, currentCube.connections.entry.toLowerCase());
  const hasValidExit = currentCube.connections?.exit && hasAdjacentCube(grid, row, col, currentCube.connections.exit.toLowerCase());
  
  // Color coding for debugging
  const pathColor = currentPath?.isValid ? 'bg-blue-500' : 'bg-red-500';
  const entryColor = hasValidEntry ? 'bg-green-500' : 'bg-yellow-500';
  const exitColor = hasValidExit ? 'bg-green-500' : 'bg-yellow-500';

  // Determine entry and exit points
  const { entry, exit } = currentCube.connections || { entry: null, exit: null };

  // Calculate connector positions and rotations
  const getConnectorStyle = (direction: 'entry' | 'exit') => {
    const point = direction === 'entry' ? entry : exit;
    let rotation = 0;
    let position = { top: '50%', left: '50%' };
    const CONNECTOR_OFFSET = '35%'; // Match physical connector position

    switch (point) {
      case 'N':
        rotation = 0;
        position = { top: CONNECTOR_OFFSET, left: '50%' };
        break;
      case 'E':
        rotation = 90;
        position = { top: '50%', left: `calc(100% - ${CONNECTOR_OFFSET})` };
        break;
      case 'S':
        rotation = 180;
        position = { top: `calc(100% - ${CONNECTOR_OFFSET})`, left: '50%' };
        break;
      case 'W':
        rotation = 270;
        position = { top: '50%', left: CONNECTOR_OFFSET };
        break;
    }

    return {
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      ...position,
    };
  };

  // Determine if this is a corner piece
  const isCorner = entry !== 'N' && exit !== 'S' && entry !== 'S' && exit !== 'N' &&
                  entry !== 'E' && exit !== 'W' && entry !== 'W' && exit !== 'E';

  return (
    <div className="absolute inset-0">
      {/* Entry point */}
      <div
        className={`absolute w-2 h-4 ${entryColor}`}
        style={getConnectorStyle('entry')}
      />
      
      {/* Exit point */}
      <div
        className={`absolute w-2 h-4 ${exitColor}`}
        style={getConnectorStyle('exit')}
      />
      
      {/* Connecting pipe */}
      {isCorner ? (
        <div
          className={`absolute w-2 h-2 ${pathColor} rounded-full`}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : (
        <div
          className={`absolute w-2 h-full ${pathColor}`}
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${
              (entry === 'N' || exit === 'N') ? 0 : 90
            }deg)`,
          }}
        />
      )}
    </div>
  );
};
