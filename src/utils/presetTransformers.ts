import { GridCell } from '@/components/types';
import { hasAdjacentCube } from './calculationUtils';

export const addCladdingToExposedEdges = (grid: GridCell[][]): GridCell[][] => {
  const result: GridCell[][] = grid.map(row => 
    row.map(cell => ({ 
      ...cell, 
      claddingEdges: new Set<'top' | 'right' | 'bottom' | 'left'>()
    }))
  );
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col].hasCube) {
        const exposedEdges = new Set<'top' | 'right' | 'bottom' | 'left'>();
        const edges = ['top', 'right', 'bottom', 'left'] as const;
        edges.forEach(edge => {
          if (!hasAdjacentCube(grid, row, col, edge)) {
            exposedEdges.add(edge);
          }
        });
        result[row][col].claddingEdges = exposedEdges;
      }
    }
  }
  
  return result;
};
