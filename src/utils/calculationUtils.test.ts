import { calculateRequirements } from './calculationUtils';
import { GridCell } from '../components/types';

const logGridState = (grid: GridCell[][], testName: string) => {
  console.log(`\n=== ${testName} ===`);
  console.log('Grid state:');
  for (let i = 0; i < grid.length; i++) {
    let row = '';
    for (let j = 0; j < grid[i].length; j++) {
      row += grid[i][j].hasCube ? '[R]' : '[ ]';
    }
    console.log(row);
  }
};

describe('calculateRequirements', () => {
  const createEmptyGrid = (): GridCell[][] => {
    return Array(3).fill(null).map(() => 
      Array(3).fill(null).map(() => ({ hasCube: false, isExtraTall: false }))
    );
  };

  const setCube = (grid: GridCell[][], row: number, col: number) => {
    grid[row][col].hasCube = true;
  };

  const logTestCase = (testName: string, grid: GridCell[][], result: any) => {
    console.log(`\n=== ${testName} Test Case ===`);
    logGridState(grid, testName);
    console.log('\nAdjacent cubes for each position:');
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i][j].hasCube) {
          console.log(`Position [${i},${j}]:`);
          console.log(`  Top: ${i > 0 && grid[i-1][j].hasCube}`);
          console.log(`  Right: ${j < 2 && grid[i][j+1].hasCube}`);
          console.log(`  Bottom: ${i < 2 && grid[i+1][j].hasCube}`);
          console.log(`  Left: ${j > 0 && grid[i][j-1].hasCube}`);
        }
      }
    }
    console.log('\nCalculated Requirements:', result);
  };

  test('single cube', () => {
    const grid = createEmptyGrid();
    setCube(grid, 1, 1); // Center cube
    const result = calculateRequirements(grid);
    logTestCase('Single Cube', grid, result);
    expect(result).toEqual({
      fourPackRegular: 1,
      twoPackRegular: 0,
      cornerConnectors: 0,
      straightCouplings: 0
    });
  });

  test('two adjacent cubes - horizontal', () => {
    const grid = createEmptyGrid();
    setCube(grid, 1, 0);
    setCube(grid, 1, 1);
    const result = calculateRequirements(grid);
    logTestCase('Two Adjacent Cubes - Horizontal', grid, result);
    expect(result).toEqual({
      fourPackRegular: 1,
      twoPackRegular: 1,
      cornerConnectors: 0,
      straightCouplings: 1
    });
  });

  test('L-shaped configuration', () => {
    const grid = createEmptyGrid();
    setCube(grid, 1, 1); // Center
    setCube(grid, 1, 2); // Right
    setCube(grid, 2, 1); // Bottom
    const result = calculateRequirements(grid);
    logTestCase('L-shaped Configuration', grid, result);
    expect(result).toEqual({
      fourPackRegular: 2,
      twoPackRegular: 0,
      cornerConnectors: 1,
      straightCouplings: 1
    });
  });

  test('U-shaped configuration', () => {
    const grid = createEmptyGrid();
    setCube(grid, 2, 0); // Bottom left
    setCube(grid, 2, 1); // Bottom center
    setCube(grid, 2, 2); // Bottom right
    setCube(grid, 1, 0); // Middle left
    setCube(grid, 1, 2); // Middle right
    const result = calculateRequirements(grid);
    logTestCase('U-shaped Configuration', grid, result);
    expect(result).toEqual({
      fourPackRegular: 3,
      twoPackRegular: 0,
      cornerConnectors: 2,
      straightCouplings: 2
    });
  });

  test('all corners configuration', () => {
    const grid = createEmptyGrid();
    // Create a plus shape to test all corner types
    setCube(grid, 0, 1); // Top
    setCube(grid, 1, 0); // Left
    setCube(grid, 1, 1); // Center
    setCube(grid, 1, 2); // Right
    setCube(grid, 2, 1); // Bottom
    const result = calculateRequirements(grid);
    logTestCase('All Corners Configuration', grid, result);
    expect(result).toEqual({
      fourPackRegular: 3,
      twoPackRegular: 0,
      cornerConnectors: 4,
      straightCouplings: 2
    });
  });
});
