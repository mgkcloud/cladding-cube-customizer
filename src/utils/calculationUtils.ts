import { GridCell, Requirements } from '../components/types';

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
    return row >= 0 && row < 3 && col >= 0 && col < 3 && grid[row][col].hasCube;
  };

  // Calculate total exposed sides for regular and extra tall
  let totalRegularSides = 0;
  let totalExtraTallSides = 0;

  // Calculate for each cell
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
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

      // Add to total sides based on height
      if (grid[row][col].isExtraTall) {
        totalExtraTallSides += exposedSides;
      } else {
        totalRegularSides += exposedSides;
      }

      // First, identify corners
      const corners = [];
      if (adjacentCubes.right && adjacentCubes.bottom) corners.push('rightBottom');
      if (adjacentCubes.bottom && adjacentCubes.left) corners.push('bottomLeft');
      if (adjacentCubes.left && adjacentCubes.top) corners.push('leftTop');
      if (adjacentCubes.top && adjacentCubes.right) corners.push('topRight');

      // Add corner connectors
      requirements.cornerConnectors += corners.length;

      // Add straight couplings for non-corner connections
      if (adjacentCubes.right && !corners.includes('rightBottom') && !corners.includes('topRight')) {
        requirements.straightCouplings++;
      }
      if (adjacentCubes.bottom && !corners.includes('rightBottom') && !corners.includes('bottomLeft')) {
        requirements.straightCouplings++;
      }
    }
  }

  // Calculate packs needed for regular height
  requirements.fourPackRegular = Math.floor(totalRegularSides / 4);
  const remainingRegularSides = totalRegularSides % 4;
  requirements.twoPackRegular = Math.ceil(remainingRegularSides / 2);

  // Calculate packs needed for extra tall
  requirements.fourPackExtraTall = Math.floor(totalExtraTallSides / 4);
  const remainingExtraTallSides = totalExtraTallSides % 4;
  requirements.twoPackExtraTall = Math.ceil(remainingExtraTallSides / 2);

  console.log('Total regular sides:', totalRegularSides);
  console.log('Total extra tall sides:', totalExtraTallSides);
  console.log('Straight couplings:', requirements.straightCouplings);
  console.log('Corner connectors:', requirements.cornerConnectors);
  console.log('Calculated requirements:', requirements);
  return requirements;
};