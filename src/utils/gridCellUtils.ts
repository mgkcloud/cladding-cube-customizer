import { GridCell, CompassDirection, CubeConnection } from './types';

export const createEmptyCell = (): GridCell => ({
  hasCube: false,
  claddingEdges: new Set<CompassDirection>(),
  connections: { entry: null, exit: null }
});

export const createCubeCell = (
  edges: CompassDirection[] = [],
  connections: CubeConnection = { entry: null, exit: null }
): GridCell => ({
  hasCube: true,
  claddingEdges: new Set<CompassDirection>(edges),
  connections
});

// Helper to create a cell with irrigation flow
export const createFlowCell = (entry: CompassDirection, exit: CompassDirection): GridCell => ({
  hasCube: true,
  claddingEdges: new Set<CompassDirection>(),
  connections: { entry, exit }
});

export const createEmptyGrid = (size: number = 3): GridCell[][] => {
  return Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => createEmptyCell())
  );
};
