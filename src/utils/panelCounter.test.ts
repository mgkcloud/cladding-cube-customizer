import { countPanels } from './panelCounter';
import { createTestGrid } from './testUtils';

describe('countPanels', () => {
  test('single cube with all edges cladded', () => {
    const grid = createTestGrid([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ], {
      '1,1': ['top', 'right', 'bottom', 'left']
    });

    const result = countPanels(grid);
    expect(result).toEqual({
      sidePanels: 2,  // top and bottom
      leftPanels: 1,  // left
      rightPanels: 1  // right
    });
  });

  test('three cubes in a line with cladding', () => {
    const grid = createTestGrid([
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ], {
      '1,0': ['top', 'bottom', 'left'],
      '1,1': ['top', 'bottom'],
      '1,2': ['top', 'bottom', 'right']
    });

    const result = countPanels(grid);
    expect(result).toEqual({
      sidePanels: 6,  // 3 pairs of top/bottom
      leftPanels: 1,  // leftmost cube
      rightPanels: 1  // rightmost cube
    });
  });

  test('L-shaped configuration with cladding', () => {
    const grid = createTestGrid([
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, 0]
    ], {
      '1,1': ['top', 'left', 'bottom'],
      '1,2': ['top', 'right'],
      '2,1': ['bottom', 'left']
    });

    const result = countPanels(grid);
    expect(result).toEqual({
      sidePanels: 4,  // 2 top + 2 bottom
      leftPanels: 2,  // 2 left edges
      rightPanels: 1  // 1 right edge
    });
  });
});
