import { GridCell } from '@/components/types';

export const createEmptyCell = (): GridCell => ({
  hasCube: false,
  claddingEdges: new Set()
});

export const createCubeCell = (edges: ('top' | 'right' | 'bottom' | 'left')[] = []): GridCell => ({
  hasCube: true,
  claddingEdges: new Set(edges)
});

export const createEmptyGrid = (size: number = 3): GridCell[][] => {
  return Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => createEmptyCell())
  );
};
