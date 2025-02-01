import { GridCell, Requirements } from '../components/FoodcubeConfigurator';

export const calculateRequirements = (grid: GridCell[][]): Requirements => {
  const requirements: Requirements = {
    fourPackRegular: 0,
    fourPackExtraTall: 0,
    twoPackRegular: 0,
    twoPackExtraTall: 0,
    cornerConnectors: 0,
    straightCouplings: 0
  };

  // Helper to check if a cell has a cube
  const hasCubeAt = (row: number, col: number) => {
    return row >= 0 && row < 9 && col >= 0 && col < 9 && grid[row][col].hasCube;
  };

  // Calculate for each cell
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!grid[row][col].hasCube) continue;

      // Count exposed sides for cladding
      let exposedSides = 0;
      const adjacentCubes = {
        top: hasCubeAt(row - 1, col),
        right: hasCubeAt(row, col + 1),
        bottom: hasCubeAt(row + 1, col),
        left: hasCubeAt(row, col - 1)
      };

      // Count exposed sides
      if (!adjacentCubes.top) exposedSides++;
      if (!adjacentCubes.right) exposedSides++;
      if (!adjacentCubes.bottom) exposedSides++;
      if (!adjacentCubes.left) exposedSides++;

      // Calculate cladding packs needed
      if (exposedSides > 0) {
        if (grid[row][col].isExtraTall) {
          requirements.fourPackExtraTall += Math.floor(exposedSides / 4);
          requirements.twoPackExtraTall += exposedSides % 4;
        } else {
          requirements.fourPackRegular += Math.floor(exposedSides / 4);
          requirements.twoPackRegular += exposedSides % 4;
        }
      }

      // Calculate straight couplings
      if (adjacentCubes.right) requirements.straightCouplings++;
      if (adjacentCubes.bottom) requirements.straightCouplings++;

      // Calculate corner connectors
      const hasCorner = (
        (adjacentCubes.right && adjacentCubes.bottom) ||
        (adjacentCubes.bottom && adjacentCubes.left) ||
        (adjacentCubes.left && adjacentCubes.top) ||
        (adjacentCubes.top && adjacentCubes.right)
      );
      
      if (hasCorner) requirements.cornerConnectors++;
    }
  }

  // Adjust for double counting of straight couplings
  requirements.straightCouplings = Math.floor(requirements.straightCouplings / 2);

  console.log('Calculated requirements:', requirements);
  return requirements;
};