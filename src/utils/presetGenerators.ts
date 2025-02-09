import { GridCell } from '@/components/types';
import { createEmptyGrid, createCubeCell } from './gridCellUtils';

export const generateStraightPreset = (): GridCell[][] => {
  const grid = createEmptyGrid();
  grid[1][0] = createCubeCell(['top', 'bottom', 'left']);
  grid[1][1] = createCubeCell(['top', 'bottom']);
  grid[1][2] = createCubeCell(['top', 'bottom', 'right']);
  return grid;
};

export const generateLShapePreset = (): GridCell[][] => {
  const grid = createEmptyGrid();
  grid[1][0] = createCubeCell(['top', 'bottom', 'left']);
  grid[1][1] = createCubeCell(['top']);
  grid[2][1] = createCubeCell(['right', 'bottom']);
  return grid;
};

export const generateUShapePreset = (): GridCell[][] => {
  const grid = createEmptyGrid();
  grid[1][0] = createCubeCell(['top', 'left']);
  grid[1][2] = createCubeCell(['top', 'right']);
  grid[2][0] = createCubeCell(['bottom', 'left']);
  grid[2][1] = createCubeCell(['bottom']);
  grid[2][2] = createCubeCell(['bottom', 'right']);
  return grid;
};
