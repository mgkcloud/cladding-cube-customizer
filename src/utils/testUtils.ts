import { GridCell } from '../components/types';
import { Direction } from './calculationUtils';

export const createTestGrid = (
  layout: number[][],
  claddingEdges: Record<string, Direction[]>
): GridCell[][] => {
  const grid: GridCell[][] = [];

  for (let row = 0; row < layout.length; row++) {
    grid[row] = [];
    for (let col = 0; col < layout[row].length; col++) {
      grid[row][col] = {
        hasCube: layout[row][col] === 1,
        claddingEdges: new Set(claddingEdges[`${row},${col}`] || [])
      };
    }
  }

  return grid;
};
