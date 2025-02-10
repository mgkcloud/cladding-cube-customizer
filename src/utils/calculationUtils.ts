import { GridCell, Requirements } from '../components/types';

const GRID_SIZE = 3;
export type Direction = 'top' | 'right' | 'bottom' | 'left';
export type CompassDirection = 'N' | 'E' | 'S' | 'W';

export const compassToDirection = (compass: CompassDirection): Direction => {
  switch (compass) {
    case 'N': return 'top';
    case 'E': return 'right';
    case 'S': return 'bottom';
    case 'W': return 'left';
  }
};

export const directionToCompass = (dir: Direction): CompassDirection => {
  switch (dir) {
    case 'top': return 'N';
    case 'right': return 'E';
    case 'bottom': return 'S';
    case 'left': return 'W';
  }
};

export const hasAdjacentCube = (grid: GridCell[][], row: number, col: number, direction: Direction | CompassDirection): boolean => {
  // Convert compass direction to regular direction if needed
  const dir = direction.length === 1 ? compassToDirection(direction as CompassDirection) : direction as Direction;
  const hasCubeAt = (r: number, c: number): boolean => {
    return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length && grid[r][c].hasCube;
  };

  switch (dir) {
    case 'top': return hasCubeAt(row - 1, col);
    case 'right': return hasCubeAt(row, col + 1);
    case 'bottom': return hasCubeAt(row + 1, col);
    case 'left': return hasCubeAt(row, col - 1);
  }
};

import { countPanels } from './panelCounter';
import { detectConnections } from './connectionDetector';
import { packPanels } from './panelPacker';

const visualizeGrid = (grid: GridCell[][]): string => {
  return '\nGrid State (C=Cube):\n' + grid.map(row => 
    row.map(cell => cell.hasCube ? 'C' : '.').join(' ')
  ).join('\n');
};

export const calculateRequirements = (grid: GridCell[][]): Requirements => {
  console.log('\n=== Starting Requirements Calculation ===');
  console.log(visualizeGrid(grid));

  // Step 1: Count all panels
  const panelCounts = countPanels(grid);
  console.log('\nValid panels before packing:', {
    side: panelCounts.sidePanels,
    left: panelCounts.leftPanels,
    right: panelCounts.rightPanels
  });

  // Step 2: Detect connections
  const connections = detectConnections(grid);
  console.log('\nConnections detected:', connections);

  // Step 3: Pack panels into sets
  const packedPanels = packPanels(panelCounts, {
    straight: connections.straightCouplings,
    cornerLeft: connections.cornerLeft || 0,
    cornerRight: connections.cornerRight || 0
  });
  console.log('\nPacked panels:', packedPanels);

  // Step 4: Return final requirements
  const requirements: Requirements = packedPanels;

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