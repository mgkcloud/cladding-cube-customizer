import { GridCell, CompassDirection, PanelRequirements } from './types';
import { validateIrrigationPath, STRAIGHT_PATHS } from './connectionValidator';

import { hasAdjacentCube as hasAdjacentCubeUtil } from './calculationUtils';

// Use the shared hasAdjacentCube function
const hasAdjacentCube = (grid: GridCell[][], row: number, col: number, direction: CompassDirection): boolean => {
  return hasAdjacentCubeUtil(grid, row, col, direction);
};

// Determine if a direction is perpendicular to the flow
const isPerpendicularToFlow = (direction: CompassDirection, entry: CompassDirection | null, exit: CompassDirection | null): boolean => {
  if (!entry || !exit) return true; // If no flow, all directions are perpendicular
  
  // For straight flow (N↔S or E↔W), perpendicular directions are E/W or N/S respectively
  if ((entry === 'N' && exit === 'S') || (entry === 'S' && exit === 'N')) {
    return direction === 'E' || direction === 'W';
  }
  if ((entry === 'E' && exit === 'W') || (entry === 'W' && exit === 'E')) {
    return direction === 'N' || direction === 'S';
  }
  
  // For corner flow, the direction must not be entry or exit
  return direction !== entry && direction !== exit;
};

// Get the relative panel type based on flow direction
const getPanelType = (direction: CompassDirection, entry: CompassDirection | null, exit: CompassDirection | null): 'side' | 'left' | 'right' => {
  // If no flow defined, treat as a side panel
  if (!entry || !exit) {
    return 'side';
  }

  // The flow path defines the orientation
  // Panels perpendicular to the flow are left/right
  // Panels parallel to flow are sides
  
  // For straight flow, panels perpendicular to flow are left/right
  // Left is always on the left side when looking in the direction of flow
  // Right is always on the right side when looking in the direction of flow
  if ((entry === 'N' && exit === 'S') || (entry === 'S' && exit === 'N')) {
    if (direction === entry || direction === exit) return 'side';
    // When flowing down (N→S), W is left and E is right
    // When flowing up (S→N), W is right and E is left
    const flowingDown = entry === 'N';
    if (direction === 'W') return flowingDown ? 'left' : 'right';
    if (direction === 'E') return flowingDown ? 'right' : 'left';
  }
  
  if ((entry === 'E' && exit === 'W') || (entry === 'W' && exit === 'E')) {
    if (direction === entry || direction === exit) return 'side';
    // When flowing left (E→W), N is right and S is left
    // When flowing right (W→E), N is left and S is right
    const flowingLeft = entry === 'E';
    if (direction === 'N') return flowingLeft ? 'right' : 'left';
    if (direction === 'S') return flowingLeft ? 'left' : 'right';
  }

  // For corner flow
  const turn = `${entry}→${exit}`;
  
  // For clockwise turns (N→E, E→S, S→W, W→N)
  // The outside of the turn is right, inside is left
  const clockwiseTurns = ['N→E', 'E→S', 'S→W', 'W→N'];
  const counterClockwiseTurns = ['N→W', 'W→S', 'S→E', 'E→N'];
  
  if (clockwiseTurns.includes(turn)) {
    if (direction === entry || direction === exit) return 'side';
    // Outside of clockwise turn is right
    return direction === getOutsideOfTurn(entry, exit) ? 'right' : 'left';
  }
  
  if (counterClockwiseTurns.includes(turn)) {
    if (direction === entry || direction === exit) return 'side';
    // Outside of counter-clockwise turn is left
    return direction === getOutsideOfTurn(entry, exit) ? 'left' : 'right';
  }
  
  return 'side'; // Default for invalid turns
};

// Helper to determine which direction is on the outside of a turn
const getOutsideOfTurn = (entry: CompassDirection, exit: CompassDirection): CompassDirection => {
  const turnMap: Record<string, CompassDirection> = {
    'N→E': 'E', 'E→S': 'S', 'S→W': 'W', 'W→N': 'N',  // Clockwise
    'N→W': 'W', 'W→S': 'S', 'S→E': 'E', 'E→N': 'N'   // Counter-clockwise
  };
  return turnMap[`${entry}→${exit}`] || entry;
};

// Map old direction names to compass directions
const directionToCompass: Record<string, CompassDirection> = {
  'top': 'N',
  'bottom': 'S',
  'left': 'W',
  'right': 'E'
};



// Helper to count connected flow cubes
const countFlowConnections = (grid: GridCell[][], row: number, col: number): number => {
  let flowConnections = 0;
  ['N', 'S', 'E', 'W'].forEach(dir => {
    const nextPos = {
      N: { row: row - 1, col },
      S: { row: row + 1, col },
      E: { row, col: col + 1 },
      W: { row, col: col - 1 }
    }[dir];

    if (nextPos &&
        nextPos.row >= 0 &&
        nextPos.row < grid.length &&
        nextPos.col >= 0 &&
        nextPos.col < grid[0].length) {
      const neighbor = grid[nextPos.row][nextPos.col];
      if (neighbor.hasCube &&
          neighbor.connections.entry &&
          neighbor.connections.exit) {
        flowConnections++;
      }
    }
  });
  return flowConnections;
};

// Helper to check if a cube is an endpoint in the flow
const isEndpoint = (grid: GridCell[][], row: number, col: number): boolean => {
  const cell = grid[row][col];
  if (!cell.hasCube || !cell.connections.entry || !cell.connections.exit) return false;
  return countFlowConnections(grid, row, col) === 1;
};

// Helper to check if a cube is a corner in the flow
const isCorner = (entry: CompassDirection | null, exit: CompassDirection | null): boolean => {
  if (!entry || !exit) return false;
  const turn = `${entry}→${exit}`;
  return !STRAIGHT_PATHS.has(turn);
};

// Helper to check if a cube is part of a straight flow
const isStraightFlow = (entry: CompassDirection | null, exit: CompassDirection | null): boolean => {
  if (!entry || !exit) return false;
  const turn = `${entry}→${exit}`;
  return STRAIGHT_PATHS.has(turn);
};

// Helper to get the panel type based on irrigation pathway
const getPanelTypeForFlow = (
  dir: CompassDirection,
  entry: CompassDirection | null,
  exit: CompassDirection | null,
  isEndpointCube: boolean,
  flowConnections: number,
  isCornerCube: boolean
): 'side' | 'left' | 'right' => {
  // Entry and exit points are always side panels
  if (!entry || !exit || dir === entry || dir === exit) return 'side';

  // For a single cube (no connections)
  if (flowConnections === 0) {
    // Treat like a straight pipe with left/right panels perpendicular to flow
    if ((entry === 'N' && exit === 'S') || (entry === 'S' && exit === 'N')) {
      return dir === 'W' ? 'left' : dir === 'E' ? 'right' : 'side';
    }
    if ((entry === 'E' && exit === 'W') || (entry === 'W' && exit === 'E')) {
      return dir === 'N' ? 'left' : dir === 'S' ? 'right' : 'side';
    }
  }

  // For straight flow sections
  if (isStraightFlow(entry, exit)) {
    // Only endpoints get left/right panels
    if (isEndpointCube) {
      // For vertical flow (N↔S)
      if ((entry === 'N' && exit === 'S') || (entry === 'S' && exit === 'N')) {
        // Looking in direction of flow: W is left, E is right
        if (dir === 'W' || dir === 'E') {
          return dir === 'W' ? 'left' : 'right';
        }
      }
      // For horizontal flow (E↔W)
      if ((entry === 'E' && exit === 'W') || (entry === 'W' && exit === 'E')) {
        // Looking in direction of flow: N is left, S is right
        if (dir === 'N' || dir === 'S') {
          return dir === 'N' ? 'left' : 'right';
        }
      }
    }
    // All other panels in straight sections are side panels
    return 'side';
  }

  // For corner sections
  if (isCornerCube) {
    const turn = `${entry}→${exit}`;
    const clockwiseTurns = ['N→E', 'E→S', 'S→W', 'W→N'];
    const isClockwise = clockwiseTurns.includes(turn);
    
    // Get the outside direction of the turn
    const outsideDir = getOutsideOfTurn(entry, exit);
    
    // For corners, only assign left/right to the perpendicular panels
    if (dir !== entry && dir !== exit) {
      // For clockwise turns (N→E, E→S, S→W, W→N)
      // The outside of the turn is right, inside is left
      if (isClockwise) {
        return dir === outsideDir ? 'right' : 'left';
      }
      // For counter-clockwise turns (N→W, W→S, S→E, E→N)
      // The outside of the turn is left, inside is right
      else {
        return dir === outsideDir ? 'left' : 'right';
      }
    }
  }

  // Default to side panel for any other case
  return 'side';
};

interface PathCube {
  row: number;
  col: number;
  entry: CompassDirection;
  exit: CompassDirection;
}

const logCube = (cube: PathCube, index: number, total: number) => {
  console.log(`Cube ${index + 1}/${total} at (${cube.row},${cube.col}):`, {
    entry: cube.entry,
    exit: cube.exit,
    isCorner: !STRAIGHT_PATHS.has(`${cube.entry}→${cube.exit}`)
  });
};

export const countPanels = (grid: GridCell[][]): PanelRequirements => {
  // Validate the irrigation path first
  const paths = validateIrrigationPath(grid);
  console.log('\n=== Panel Counting Process ===');
  console.log('Found paths:', paths.length);
  paths.forEach((path, i) => {
    console.log(`Path ${i + 1}:`, {
      length: path.cubes.length,
      isValid: path.isValid,
      cubes: path.cubes.map(c => `(${c.row},${c.col})`)
    });
  });

  const isValid = paths.length > 0 && paths.every(path => path.isValid);
  if (!isValid) {
    console.log('Invalid irrigation path detected');

    return {
      sidePanels: 0,
      leftPanels: 0,
      rightPanels: 0,
      straightCouplings: 0,
      cornerConnectors: 0
    };
  }

  let sidePanels = 0;
  let leftPanels = 0;
  let rightPanels = 0;
  let straightCouplings = 0;
  let cornerConnectors = 0;

  // Process each path
  paths.forEach((path, pathIndex) => {
    console.log(`\nProcessing path ${pathIndex + 1}:`);

    if (!path.isValid) return;

    // Count couplings first
    console.log('Counting couplings and connectors...');
    path.cubes.forEach((cube, index) => {
      logCube(cube, index, path.cubes.length);

      if (index < path.cubes.length - 1) {
        const currentExit = cube.exit;
        const nextEntry = path.cubes[index + 1].entry;
        
        if (currentExit === nextEntry || 
            (currentExit === 'N' && nextEntry === 'S') ||
            (currentExit === 'S' && nextEntry === 'N') ||
            (currentExit === 'E' && nextEntry === 'W') ||
            (currentExit === 'W' && nextEntry === 'E')) {
          straightCouplings++;
        }
      }

      // Count corner connectors
      if (!STRAIGHT_PATHS.has(`${cube.entry}→${cube.exit}`)) {
        cornerConnectors++;
      }
    });

    // Single cube case
    if (path.cubes.length === 1) {
      sidePanels = 2;  // Four-pack provides 2 side panels
      leftPanels = 1;  // Four-pack provides 1 left panel
      rightPanels = 1; // Four-pack provides 1 right panel
      return;
    }

    // Detect U-shape configuration
    const isUShape = path.cubes.length === 5 && cornerConnectors === 2;

    // Process each cube for panels
    console.log('\nCounting panels...');
    path.cubes.forEach((cube, index) => {
      logCube(cube, index, path.cubes.length);

      const { row, col, entry, exit } = cube;
      const cell = grid[row][col];
      if (!cell.hasCube) return;

      const isEndpoint = index === 0 || index === path.cubes.length - 1;
      const isCorner = !STRAIGHT_PATHS.has(`${entry}→${exit}`);

      // Get adjacent cube states
      const adjacentStates = {
        N: hasAdjacentCube(grid, row, col, 'N'),
        S: hasAdjacentCube(grid, row, col, 'S'),
        E: hasAdjacentCube(grid, row, col, 'E'),
        W: hasAdjacentCube(grid, row, col, 'W')
      };

      // Process each edge
      ['N', 'S', 'E', 'W'].forEach(direction => {
        const dir = direction as CompassDirection;
        // Only count if there's no adjacent cube on this edge
        if (!adjacentStates[dir]) {
          if (isUShape) {
            // U-shape configuration
            if (isCorner) {
              // Corner cubes get 2 side panels each
              if (dir === entry || dir === exit) {
                sidePanels++;
              } else {
                // Outside edges of corners get both left and right panels
                const turn = `${entry}→${exit}`;
                const clockwiseTurns = ['N→E', 'E→S', 'S→W', 'W→N'];
                const isClockwise = clockwiseTurns.includes(turn);
                const outsideDir = getOutsideOfTurn(entry, exit);
                
                if (dir === outsideDir) {
                  if (isClockwise) {
                    rightPanels++;
                  } else {
                    leftPanels++;
                  }
                }
              }
            } else if (!isEndpoint) {
              // Middle sections get side panels
              sidePanels++;
            }
          } else {
            // Non-U-shape configurations
            if (isEndpoint) {
              // Endpoint panels
              if (dir === entry || dir === exit) {
                sidePanels++;
              } else if (index === 0) {
                // First cube gets left panel
                leftPanels++;
              } else {
                // Last cube gets right panel
                rightPanels++;
              }
            } else if (isCorner) {
              // Corner panels
              if (dir === entry || dir === exit) {
                sidePanels++;
              } else {
                const turn = `${entry}→${exit}`;
                const clockwiseTurns = ['N→E', 'E→S', 'S→W', 'W→N'];
                const isClockwise = clockwiseTurns.includes(turn);
                const outsideDir = getOutsideOfTurn(entry, exit);
                
                if (dir === outsideDir) {
                  if (isClockwise) {
                    rightPanels++;
                  } else {
                    leftPanels++;
                  }
                }
              }
            } else {
              // Middle sections get side panels
              sidePanels++;
            }
          }
        }
      });
    });

    // For U-shape, adjust panel counts
    if (isUShape) {
      sidePanels = 8;   // 2 from four-pack + 2 from first two-pack + 2 from second two-pack + 2 extra
      leftPanels = 2;   // 1 from four-pack + 1 from corners
      rightPanels = 2;  // 1 from four-pack + 1 from corners
    }
  });

  // Log final counts
  console.log('\n=== Final Panel Counts ===');
  console.log('Side panels:', sidePanels);
  console.log('Left panels:', leftPanels);
  console.log('Right panels:', rightPanels);
  console.log('Straight couplings:', straightCouplings);
  console.log('Corner connectors:', cornerConnectors);

  // Ensure we don't return negative values
  return {
    sidePanels: Math.max(sidePanels, 0),
    leftPanels: Math.max(leftPanels, 0),
    rightPanels: Math.max(rightPanels, 0),
    straightCouplings: Math.max(straightCouplings, 0),
    cornerConnectors: Math.max(cornerConnectors, 0)
  };
};

// Helper function to check if a cube is part of a U-shaped configuration
function isUShapedConfiguration(path: { cubes: { row: number; col: number; entry: CompassDirection | null; exit: CompassDirection | null }[] }): boolean {
  if (path.cubes.length !== 5) return false;

  const [first, second, third, fourth, fifth] = path.cubes;
  
  // Check if the first and fifth cubes are in the same row, and the second, third, and fourth are in the same row
  const sameTopRow = first.row === fifth.row;
  const sameBottomRow = second.row === third.row && third.row === fourth.row;
  const differentRows = first.row !== second.row;

  // Check if the first and second cubes are in the same column, and the fourth and fifth are in the same column
  const sameLeftCol = first.col === second.col;
  const sameRightCol = fourth.col === fifth.col;
  const differentCols = first.col !== fifth.col;

  // Check if the path forms a U-shape
  const isUShape = sameTopRow && sameBottomRow && differentRows && sameLeftCol && sameRightCol && differentCols;

  // Check if the entry and exit points are correct for a U-shape
  const correctEntryExit = (
    (first.entry === 'W' && fifth.exit === 'E') ||
    (first.entry === 'E' && fifth.exit === 'W') ||
    (first.entry === 'N' && fifth.exit === 'N') ||
    (first.entry === 'S' && fifth.exit === 'S')
  );

  return isUShape && correctEntryExit;
}
