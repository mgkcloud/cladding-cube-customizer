import { detectConnections } from './connectionDetector';
import { createTestGrid } from './testUtils';

describe('detectConnections', () => {
  // Truth: For a single cube with all edges(4 edges) cladded
  // No connectors needed - standalone cube
  test('single cube with all edges cladded', () => {
    const grid = createTestGrid([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ], {
      '1,1': ['top', 'right', 'bottom', 'left']
    });

    const result = detectConnections(grid);
    expect(result).toEqual({
      straightCouplings: 0,  // No adjacent cubes
      cornerConnectors: 0    // No adjacent cubes
    });
  });

  // Truth: For three cubes in a line(8 edges)
  // Needs: 2 straight couplings
  test('three cubes in a line with cladding', () => {
    const grid = createTestGrid([
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ], {
      '1,0': ['top', 'bottom', 'left'],  // Leftmost cube
      '1,1': ['top', 'bottom'],          // Middle cube
      '1,2': ['top', 'bottom', 'right']   // Rightmost cube
    });

    const result = detectConnections(grid);
    expect(result).toEqual({
      straightCouplings: 3,  // Three straight connections between three cubes
      cornerConnectors: 0    // No corners in a straight line
    });
  });

  // Truth: For L-shaped configuration(8 edges)
  // Needs: 1 corner connector, 1 straight coupling
  test('L-shaped configuration with cladding', () => {
    const grid = createTestGrid([
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, 0]
    ], {
      '1,1': ['top', 'left'],           // Top-left of L
      '1,2': ['top', 'right'],          // Top-right of L
      '2,1': ['bottom', 'left']         // Bottom of L
    });

    const result = detectConnections(grid);
    expect(result).toEqual({
      straightCouplings: 1,  // One straight connection in vertical part
      cornerConnectors: 1    // One corner where the L meets
    });
  });

  // Truth: For U-shaped configuration(12 edges)
  // Needs: 2 corner connectors, 2 straight couplings
  test('U-shaped configuration', () => {
    const grid = createTestGrid([
      [0, 0, 0],
      [1, 0, 1],
      [1, 1, 1]
    ], {
      '1,0': ['top', 'left'],           // Top-left of U
      '1,2': ['top', 'right'],          // Top-right of U
      '2,0': ['bottom', 'left'],        // Bottom-left of U
      '2,1': ['bottom'],                // Bottom-middle of U
      '2,2': ['bottom', 'right']        // Bottom-right of U
    });

    const result = detectConnections(grid);
    expect(result).toEqual({
      straightCouplings: 2,  // Two straight connections in bottom row
      cornerConnectors: 2    // Two corners where vertical meets horizontal
    });
  });
});
