import { GridCell, Requirements } from '../components/types';

const GRID_SIZE = 3;

const hasAdjacentCube = (grid: GridCell[][], row: number, col: number, direction: string) => {
  const hasCubeAt = (r: number, c: number) => {
    return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length && grid[r][c].hasCube;
  };

  switch (direction) {
    case 'top':
      return hasCubeAt(row - 1, col);
    case 'right':
      return hasCubeAt(row, col + 1);
    case 'bottom':
      return hasCubeAt(row + 1, col);
    case 'left':
      return hasCubeAt(row, col - 1);
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
};

export const calculateRequirements = (grid: GridCell[][]): Requirements => {
  const requirements: Requirements = {
    fourPackRegular: 0,
    twoPackRegular: 0,
    cornerConnectors: 0,
    straightCouplings: 0
  };

  // Helper to check if a cell has a cube
  const hasCubeAt = (row: number, col: number) => {
    return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && grid[row][col].hasCube;
  };

  // Helper to check if a cell has an adjacent cube
  const hasAdjacentCube = (grid: GridCell[][], row: number, col: number, direction: string) => {
    switch (direction) {
      case 'top':
        return hasCubeAt(row - 1, col);
      case 'right':
        return hasCubeAt(row, col + 1);
      case 'bottom':
        return hasCubeAt(row + 1, col);
      case 'left':
        return hasCubeAt(row, col - 1);
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }
  };

  // Calculate total exposed sides for regular height
  let totalRegularSides = 0;

  // Calculate for each cell
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col].hasCube) continue;

      // Calculate exposed sides for cladding
      const exposedSides = calculateExposedSides(grid, row, col);
      
      // Add to total sides
      totalRegularSides += exposedSides;

      // Count straight connections and L-configurations
      let cornerCount = 0;
      
      // Count corners first
      if (hasAdjacentCube(grid, row, col, 'right') && hasAdjacentCube(grid, row, col, 'bottom')) cornerCount++;
      if (hasAdjacentCube(grid, row, col, 'bottom') && hasAdjacentCube(grid, row, col, 'left')) cornerCount++;
      if (hasAdjacentCube(grid, row, col, 'left') && hasAdjacentCube(grid, row, col, 'top')) cornerCount++;
      if (hasAdjacentCube(grid, row, col, 'top') && hasAdjacentCube(grid, row, col, 'right')) cornerCount++;
      
      // Add corner connectors
      requirements.cornerConnectors += cornerCount;
      
      // Count straight connections
      let straightConnections = 0;
      
      // For each direction, count as straight if it's not part of a corner
      if (hasAdjacentCube(grid, row, col, 'right') && !hasAdjacentCube(grid, row, col, 'bottom') && !hasAdjacentCube(grid, row, col, 'top')) straightConnections++;
      if (hasAdjacentCube(grid, row, col, 'bottom') && !hasAdjacentCube(grid, row, col, 'left') && !hasAdjacentCube(grid, row, col, 'right')) straightConnections++;
      if (hasAdjacentCube(grid, row, col, 'left') && !hasAdjacentCube(grid, row, col, 'top') && !hasAdjacentCube(grid, row, col, 'bottom')) straightConnections++;
      if (hasAdjacentCube(grid, row, col, 'top') && !hasAdjacentCube(grid, row, col, 'right') && !hasAdjacentCube(grid, row, col, 'left')) straightConnections++;
      
      // Add straight couplings
      requirements.straightCouplings += straightConnections;
    }
  }

  // Calculate packs needed for regular height
  requirements.fourPackRegular = Math.ceil(totalRegularSides / 4);
  const remainingRegularSides = totalRegularSides % 4;
  if (remainingRegularSides === 2) {
    requirements.twoPackRegular = 1;
    requirements.fourPackRegular--;
  } else {
    requirements.twoPackRegular = 0;
  }

  // Adjust for double counting of straight couplings
  requirements.straightCouplings = Math.floor(requirements.straightCouplings / 2);

  console.log('Total regular sides:', totalRegularSides);
  console.log('Calculated requirements:', requirements);
  return requirements;
};

function calculateExposedSides(
  grid: GridCell[][],
  row: number,
  col: number
): number {
  const cell = grid[row][col];
  let exposed = 4 - cell.claddingEdges.size;
  
  // Existing adjacency checks remain unchanged
  if (hasAdjacentCube(grid, row, col, 'top')) exposed--;
  if (hasAdjacentCube(grid, row, col, 'right')) exposed--;
  if (hasAdjacentCube(grid, row, col, 'bottom')) exposed--;
  if (hasAdjacentCube(grid, row, col, 'left')) exposed--;

  return Math.max(exposed, 0);
}