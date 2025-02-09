import { GridCell } from '../components/types';
import { hasAdjacentCube, Direction } from './calculationUtils';

export interface PanelCounts {
  sidePanels: number;
  leftPanels: number;
  rightPanels: number;
}

export const countPanels = (grid: GridCell[][]): PanelCounts => {
  let sidePanels = 0;
  let leftPanels = 0;
  let rightPanels = 0;

  // Process each cube in the grid
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const cell = grid[row][col];
      if (!cell.hasCube) continue;

      // Get adjacent cube states
      const adjacentStates = {
        top: hasAdjacentCube(grid, row, col, 'top'),
        right: hasAdjacentCube(grid, row, col, 'right'),
        bottom: hasAdjacentCube(grid, row, col, 'bottom'),
        left: hasAdjacentCube(grid, row, col, 'left')
      };

      // Process cladding edges
      cell.claddingEdges.forEach(edge => {
        const currentEdge = edge as Direction;
        
        // Only count if there's no adjacent cube on this edge
        if (!adjacentStates[currentEdge]) {
          // Count panels based on edge type
          if (currentEdge === 'top' || currentEdge === 'bottom') {
            sidePanels++;
          } else if (currentEdge === 'left') {
            leftPanels++;
          } else if (currentEdge === 'right') {
            rightPanels++;
          }
        }
      });
    }
  }

  return {
    sidePanels,
    leftPanels,
    rightPanels
  };
};
