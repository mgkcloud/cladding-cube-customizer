import { GridCell, Requirements } from '../components/types';

const GRID_SIZE = 3;

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

  // Calculate total exposed sides for regular height
  let totalRegularSides = 0;

  // Calculate for each cell
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col].hasCube) continue;

      const adjacentCubes = {
        top: hasCubeAt(row - 1, col),
        right: hasCubeAt(row, col + 1),
        bottom: hasCubeAt(row + 1, col),
        left: hasCubeAt(row, col - 1)
      };

      // Count exposed sides for cladding
      let exposedSides = 4; // Start with all sides exposed
      
      // Count unexposed sides (connected to other cubes)
      let unexposedSides = 0;
      if (adjacentCubes.top) unexposedSides++;
      if (adjacentCubes.right) unexposedSides++;
      if (adjacentCubes.bottom) unexposedSides++;
      if (adjacentCubes.left) unexposedSides++;
      
      // Calculate exposed sides
      exposedSides = 4 - unexposedSides;
      
      // Add to total sides
      totalRegularSides += exposedSides;

      // Count straight connections and L-configurations
      let cornerCount = 0;
      
      // Count corners first
      if (adjacentCubes.right && adjacentCubes.bottom) cornerCount++;
      if (adjacentCubes.bottom && adjacentCubes.left) cornerCount++;
      if (adjacentCubes.left && adjacentCubes.top) cornerCount++;
      if (adjacentCubes.top && adjacentCubes.right) cornerCount++;
      
      // Add corner connectors
      requirements.cornerConnectors += cornerCount;
      
      // Count straight connections
      let straightConnections = 0;
      
      // For each direction, count as straight if it's not part of a corner
      if (adjacentCubes.right && !adjacentCubes.bottom && !adjacentCubes.top) straightConnections++;
      if (adjacentCubes.bottom && !adjacentCubes.left && !adjacentCubes.right) straightConnections++;
      if (adjacentCubes.left && !adjacentCubes.top && !adjacentCubes.bottom) straightConnections++;
      if (adjacentCubes.top && !adjacentCubes.right && !adjacentCubes.left) straightConnections++;
      
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