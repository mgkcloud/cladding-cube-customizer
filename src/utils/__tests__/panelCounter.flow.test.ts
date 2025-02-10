import { GridCell, CompassDirection } from '../types';
import { countPanels } from '../panelCounter';
import { createTestGrid } from '../testUtils';

interface FlowConnection {
  entry: CompassDirection;
  exit: CompassDirection;
}

describe('Flow-Based Panel Counter', () => {
  describe('Single Cube Configuration (4 edges)', () => {
    it('should give 1 four-pack (2 side + 1 left + 1 right)', () => {
      // Single cube with flow from West to East
      const grid = createTestGrid(
        [[1]],
        {
          '0,0': { entry: 'W' as CompassDirection, exit: 'E' as CompassDirection }
        }
      );
      
      const result = countPanels(grid);
      expect(result).toEqual({
        sidePanels: 2,    // Front and back (entry/exit)
        leftPanels: 1,    // Left side of flow
        rightPanels: 1    // Right side of flow
      });
    });
  });

  describe('Three Cubes in Line (8 edges)', () => {
    it('should give 1 four-pack + 2 two-packs', () => {
      // Three cubes with continuous flow West to East
      const grid = createTestGrid(
        [[1, 1, 1]],
        {
          '0,0': { entry: 'W' as CompassDirection, exit: 'E' as CompassDirection },
          '0,1': { entry: 'W' as CompassDirection, exit: 'E' as CompassDirection },
          '0,2': { entry: 'W' as CompassDirection, exit: 'E' as CompassDirection }
        }
      );
      
      const result = countPanels(grid);
      expect(result).toEqual({
        sidePanels: 6,    // 2 from four-pack + 2 + 2 from two-packs
        leftPanels: 1,    // Left side at start
        rightPanels: 1    // Right side at end
      });
    });
  });

  describe('L-Shape Configuration (8 edges)', () => {
    it('should give 1 four-pack + 2 two-packs + 1 extra side', () => {
      // L-shape with flow turning from West to South
      const grid = createTestGrid(
        [
          [1, 1],
          [0, 1]
        ],
        {
          '0,0': { entry: 'W' as CompassDirection, exit: 'E' as CompassDirection },
          '0,1': { entry: 'W' as CompassDirection, exit: 'S' as CompassDirection },
          '1,1': { entry: 'N' as CompassDirection, exit: 'S' as CompassDirection }
        }
      );
      
      const result = countPanels(grid);
      expect(result).toEqual({
        sidePanels: 5,    // 2 from four-pack + 2 from two-pack + 1 extra
        leftPanels: 2,    // 1 from four-pack + 1 extra
        rightPanels: 1    // from four-pack
      });
    });
  });

  describe('U-Shape Configuration (12 edges)', () => {
    it('should give 1 four-pack + 2 two-packs', () => {
      // U-shape with flow West→South→East
      const grid = createTestGrid(
        [
          [1, 1, 1],
          [1, 0, 1]
        ],
        {
          '0,0': { entry: 'W' as CompassDirection, exit: 'S' as CompassDirection },
          '1,0': { entry: 'N' as CompassDirection, exit: 'E' as CompassDirection },
          '1,1': { entry: 'W' as CompassDirection, exit: 'E' as CompassDirection },
          '1,2': { entry: 'W' as CompassDirection, exit: 'N' as CompassDirection },
          '0,2': { entry: 'S' as CompassDirection, exit: 'E' as CompassDirection }
        }
      );
      
      const result = countPanels(grid);
      expect(result).toEqual({
        sidePanels: 6,    // 2 from four-pack + 2 + 2 from two-packs
        leftPanels: 1,    // Left side at start
        rightPanels: 1    // Right side at end
      });
    });
  });
});
