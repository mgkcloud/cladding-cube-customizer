import { GridCell, CompassDirection, ConnectionPath, CouplingRequirements } from './types';

// Define valid turns and their coupling types
const VALID_TURNS = new Map<string, 'corner-left' | 'corner-right'>([
  ['N→E', 'corner-right'],
  ['E→S', 'corner-right'],
  ['S→W', 'corner-right'],
  ['W→N', 'corner-right'],
  ['N→W', 'corner-left'],
  ['W→S', 'corner-left'],
  ['S→E', 'corner-left'],
  ['E→N', 'corner-left'],
]);

export const STRAIGHT_PATHS = new Set(['N→S', 'S→N', 'E→W', 'W→E']);

// Get opposite direction
const getOppositeDirection = (dir: CompassDirection): CompassDirection => {
  switch (dir) {
    case 'N': return 'S';
    case 'S': return 'N';
    case 'E': return 'W';
    case 'W': return 'E';
  }
};

// Validate that a cube's flow follows snake-like rules
const validateFlow = (grid: GridCell[][], row: number, col: number): boolean => {
  const cell = grid[row][col];
  if (!cell.hasCube) return true; // Empty cells are valid
  if (!cell.connections) return false; // Must have connections defined

  const { entry, exit } = cell.connections;
  if (!entry || !exit) return false; // Must have both entry and exit defined

  // Validate flow direction
  const flow = `${entry}→${exit}`;
  if (!STRAIGHT_PATHS.has(flow) && !VALID_TURNS.has(flow)) {
    return false; // Must be either straight or valid turn
  }

  // Count both incoming and outgoing connections
  let incomingConnections = 0;
  let outgoingConnections = 0;

  ['N', 'S', 'E', 'W'].forEach(dir => {
    const nextPos = {
      N: { row: row - 1, col },
      S: { row: row + 1, col },
      E: { row, col: col + 1 },
      W: { row, col: col - 1 },
    }[dir];

    if (nextPos && 
        nextPos.row >= 0 && 
        nextPos.row < grid.length && 
        nextPos.col >= 0 && 
        nextPos.col < grid[0].length) {
      const neighbor = grid[nextPos.row][nextPos.col];
      if (neighbor.hasCube && neighbor.connections) {
        // Check incoming connections
        if (neighbor.connections.exit === getOppositeDirection(dir as CompassDirection)) {
          incomingConnections++;
        }
        // Check outgoing connections
        if (neighbor.connections.entry === getOppositeDirection(dir as CompassDirection)) {
          outgoingConnections++;
        }
      }
    }
  });

  // Each cube must have exactly one entry and one exit connection
  return incomingConnections === 1 && outgoingConnections === 1;
};

// Check if a cell has a valid connection to its neighbor
const hasValidConnection = (
  grid: GridCell[][],
  row: number,
  col: number,
  direction: CompassDirection
): boolean => {
  const nextPos = {
    N: { row: row - 1, col },
    S: { row: row + 1, col },
    E: { row, col: col + 1 },
    W: { row, col: col - 1 },
  }[direction];

  if (!nextPos || 
      nextPos.row < 0 || 
      nextPos.row >= grid.length || 
      nextPos.col < 0 || 
      nextPos.col >= grid[0].length) {
    return false;
  }

  const nextCell = grid[nextPos.row][nextPos.col];
  if (!nextCell.hasCube) return false;

  // If either cell doesn't have connections defined, they're not connected
  if (!nextCell.connections) return false;

  const oppositeDir = getOppositeDirection(direction);
  return nextCell.connections.entry === oppositeDir || nextCell.connections.exit === oppositeDir;
};

// Find all connected cubes starting from a position
const findConnectedCubes = (
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  visited: Set<string>,
  prevDirection: CompassDirection | null = null
): Array<[number, number]> => {
  console.log('\n=== Finding Connected Cubes ===');
  console.log(`Starting at (${startRow},${startCol})`);
  const result: Array<[number, number]> = [];
  const stack: Array<[number, number]> = [[startRow, startCol]];

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    const key = `${row},${col}`;
    console.log(`\nChecking cube at (${row},${col})`);
    
    if (visited.has(key)) {
      console.log('Already visited, skipping');
      continue;
    }
    visited.add(key);
    result.push([row, col]);
    console.log('Added to connected cubes');

    // Check all directions
    ['N', 'S', 'E', 'W'].forEach((dir) => {
      console.log(`\nChecking direction: ${dir}`);
      const nextPos = {
        N: { row: row - 1, col },
        S: { row: row + 1, col },
        E: { row, col: col + 1 },
        W: { row, col: col - 1 },
      }[dir as CompassDirection];

      if (nextPos && 
          nextPos.row >= 0 && 
          nextPos.row < grid.length && 
          nextPos.col >= 0 && 
          nextPos.col < grid[0].length &&
          grid[nextPos.row][nextPos.col].hasCube) {
        console.log(`Found connected cube at (${nextPos.row},${nextPos.col})`);
        stack.push([nextPos.row, nextPos.col]);
      }
    });
  }

  return result;
};

// Validate a single path through connected cubes
const validatePath = (
  grid: GridCell[][],
  cubes: Array<[number, number]>
): ConnectionPath => {
  console.log('\n=== Validating Path ===');
  console.log('Cubes to validate:', cubes.map(([r, c]) => `(${r},${c})`));
  const path: ConnectionPath = {
    sequence: 1,
    cubes: [],
    isValid: true
  };

  // Track visited positions to prevent loops
  const visited = new Set<string>();

  // Find start cube (one with only one connection)
  console.log('Looking for start cube...');
  let startCube = cubes[0];
  for (const [row, col] of cubes) {
    const cell = grid[row][col];
    if (cell.hasCube && cell.connections && countFlowConnections(grid, row, col) === 1) {
      startCube = [row, col];
      console.log(`Found start cube at (${row},${col})`);
      break;
    }
  }

  // Start from first cube and follow the flow
  let current = startCube;
  let lastDirection: CompassDirection | null = null;

  while (current && path.isValid) {
    console.log('\nProcessing cube:', current);
    const [row, col] = current;
    const key = `${row},${col}`;
    
    // Prevent loops
    if (visited.has(key)) {
      path.isValid = false;
      break;
    }
    visited.add(key);

    const cell = grid[row][col];
    if (!cell.hasCube || !cell.connections || !cell.connections.entry || !cell.connections.exit) {
      console.log('Invalid cube - missing required properties:', {
        hasCube: cell.hasCube,
        hasConnections: !!cell.connections,
        entry: cell.connections?.entry,
        exit: cell.connections?.exit
      });
      path.isValid = false;
      break;
    }

    const { entry, exit } = cell.connections;
    const connectionKey = `${entry}→${exit}`;
    console.log('Cube connections:', { entry, exit, connectionKey });

    // Validate connection type
    if (!STRAIGHT_PATHS.has(connectionKey) && !VALID_TURNS.has(connectionKey)) {
      console.log('Invalid connection type:', {
        connectionKey,
        isStraight: STRAIGHT_PATHS.has(connectionKey),
        isValidTurn: VALID_TURNS.has(connectionKey)
      });
      path.isValid = false;
      break;
    }

    // Validate flow continuity (except for first cube)
    if (lastDirection && entry !== getOppositeDirection(lastDirection)) {
      path.isValid = false;
      break;
    }

    path.cubes.push({
      row,
      col,
      entry,
      exit
    });

    // Find next cube in the path
    const nextPos = {
      N: { row: row - 1, col },
      S: { row: row + 1, col },
      E: { row, col: col + 1 },
      W: { row, col: col - 1 }
    }[exit];

    if (nextPos &&
        nextPos.row >= 0 &&
        nextPos.row < grid.length &&
        nextPos.col >= 0 &&
        nextPos.col < grid[0].length &&
        grid[nextPos.row][nextPos.col].hasCube) {
      current = [nextPos.row, nextPos.col];
      lastDirection = exit;
    } else {
      // End of path reached
      break;
    }
  }

  // Validate that we visited all connected cubes
  path.isValid = path.isValid && visited.size === cubes.length;

  // Helper to count flow connections for a cube
  function countFlowConnections(grid: GridCell[][], row: number, col: number): number {
    let connections = 0;
    ['N', 'S', 'E', 'W'].forEach(dir => {
      const nextPos = {
        N: { row: row - 1, col },
        S: { row: row + 1, col },
        E: { row, col: col + 1 },
        W: { row, col: col - 1 }
      }[dir as CompassDirection];

      if (nextPos &&
          nextPos.row >= 0 &&
          nextPos.row < grid.length &&
          nextPos.col >= 0 &&
          nextPos.col < grid[0].length) {
        const neighbor = grid[nextPos.row][nextPos.col];
        if (neighbor.hasCube && neighbor.connections) {
          connections++;
        }
      }
    });
    return connections;
  }

  return path;
};

import { debugLogger } from './debugLogger';

const logValidationStep = (step: string, details: any = {}) => {
  debugLogger.log(`[Irrigation Path] ${step}`, details);
};

export const validateIrrigationPath = (grid: GridCell[][]): ConnectionPath[] => {
  logValidationStep('Starting validation');
  const paths: ConnectionPath[] = [];
  const visited = new Set<string>();

  // Find all connected cube groups and validate each
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const key = `${row},${col}`;
      if (!visited.has(key) && grid[row][col].hasCube) {
        const connectedCubes = findConnectedCubes(grid, row, col, visited);
        const path = validatePath(grid, connectedCubes);
        paths.push(path);
      }
    }
  }

  return paths;
};

export const calculateCouplings = (paths: ConnectionPath[]): CouplingRequirements => {
  const requirements: CouplingRequirements = {
    straight: 0,
    cornerLeft: 0,
    cornerRight: 0
  };

  paths.forEach(path => {
    if (!path.isValid) return;

    path.cubes.forEach(cube => {
      const connectionKey = `${cube.entry}→${cube.exit}`;
      
      if (STRAIGHT_PATHS.has(connectionKey)) {
        requirements.straight++;
      } else {
        const turn = VALID_TURNS.get(connectionKey);
        if (turn === 'corner-left') {
          requirements.cornerLeft++;
        } else if (turn === 'corner-right') {
          requirements.cornerRight++;
        }
      }
    });
  });

  return requirements;
};
