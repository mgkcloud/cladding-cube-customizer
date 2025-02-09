import { GridCell, Requirements } from '../components/types';

const GRID_SIZE = 3;
export type Direction = 'top' | 'right' | 'bottom' | 'left';

export const hasAdjacentCube = (grid: GridCell[][], row: number, col: number, direction: Direction): boolean => {
  const hasCubeAt = (r: number, c: number): boolean => {
    return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length && grid[r][c].hasCube;
  };

  switch (direction) {
    case 'top': return hasCubeAt(row - 1, col);
    case 'right': return hasCubeAt(row, col + 1);
    case 'bottom': return hasCubeAt(row + 1, col);
    case 'left': return hasCubeAt(row, col - 1);
  }
};

import { countPanels } from './panelCounter';
import { detectConnections } from './connectionDetector';
import { packPanels } from './panelPacker';

export const calculateRequirements = (grid: GridCell[][]): Requirements => {
  console.log('\n=== Starting Requirements Calculation ===');

  // Step 1: Count all panels
  const panelCounts = countPanels(grid);
  console.log('\nValid panels before packing:', {
    side: panelCounts.sidePanels,
    left: panelCounts.leftPanels,
    right: panelCounts.rightPanels
  });

  // Step 2: Detect connections
  const connections = detectConnections(grid);

  // Step 3: Pack panels into sets
  const packedPanels = packPanels(panelCounts);

  // Step 4: Combine results
  const requirements: Requirements = {
    ...packedPanels,
    ...connections
  };

  console.log('Final requirements:', requirements);
  return requirements;
};

export function calculateExposedSides(
  grid: GridCell[][],
  row: number,
  col: number
): number {
  const cell = grid[row][col];
  let exposed = 4;
  
  ['top', 'right', 'bottom', 'left'].forEach(dir => {
    if (hasAdjacentCube(grid, row, col, dir as Direction)) exposed--;
  });

  return Math.max(exposed - cell.claddingEdges.size, 0);
}