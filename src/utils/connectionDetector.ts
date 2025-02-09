import { GridCell } from '../components/types';
import { hasAdjacentCube, Direction } from './calculationUtils';

export interface ConnectionCounts {
  straightCouplings: number;
  cornerConnectors: number;
}

export const detectConnections = (grid: GridCell[][]): ConnectionCounts => {
  const connections: ConnectionCounts = {
    straightCouplings: 0,
    cornerConnectors: 0
  };

  // Track processed connections to avoid duplicates
  const processedStraightConnections = new Set<string>();
  const processedCornerConnections = new Set<string>();

  // Process each cube in the grid
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const cell = grid[row][col];
      if (!cell.hasCube) continue;

      // Get adjacent cube states
      const adjacentStates = {
        top: hasAdjacentCube(grid, row, col, 'top'),
        right: hasAdjacentCube(grid, row, col, 'right'),
        bottom: hasAdjacentCube(grid, row, col, 'bottom'),
        left: hasAdjacentCube(grid, row, col, 'left')
      };

      // Process straight connections
      const oppositeEdgeMap: Record<Direction, Direction> = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      };

      // Count straight couplings between adjacent cubes with cladding
      Object.entries(adjacentStates).forEach(([edge, hasAdjacent]) => {
        if (hasAdjacent) {
          const currentEdge = edge as Direction;
          const adjacentRow = row + (currentEdge === 'bottom' ? 1 : currentEdge === 'top' ? -1 : 0);
          const adjacentCol = col + (currentEdge === 'right' ? 1 : currentEdge === 'left' ? -1 : 0);
          const adjacentCell = grid[adjacentRow][adjacentCol];
          const oppositeEdge = oppositeEdgeMap[currentEdge];
          
          // Count coupling if either cube has cladding on the shared edge
          if (cell.claddingEdges.has(currentEdge) || adjacentCell.claddingEdges.has(oppositeEdge)) {
            const connectionKey = `${row},${col}-${currentEdge}`;
            const reverseKey = `${adjacentRow},${adjacentCol}-${oppositeEdge}`;
            
            // Only count each connection once
            if (!processedStraightConnections.has(connectionKey) && 
                !processedStraightConnections.has(reverseKey)) {
              connections.straightCouplings++;
              processedStraightConnections.add(connectionKey);
              processedStraightConnections.add(reverseKey);
            }
          }
        }
      });

      // Check for corner connections where we have two adjacent cubes at right angles
      if (adjacentStates.top && adjacentStates.right) {
        // Check if any of the cubes involved have cladding on their edges
        const hasTopCladding = cell.claddingEdges.has('top') || grid[row-1][col].claddingEdges.has('bottom');
        const hasRightCladding = cell.claddingEdges.has('right') || grid[row][col+1].claddingEdges.has('left');
        
        if (hasTopCladding && hasRightCladding) {
          const cornerKey = `${row},${col}-top-right`;
          if (!processedCornerConnections.has(cornerKey)) {
            connections.cornerConnectors++;
            processedCornerConnections.add(cornerKey);
          }
        }
      }
      if (adjacentStates.right && adjacentStates.bottom) {
        const hasRightCladding = cell.claddingEdges.has('right') || grid[row][col+1].claddingEdges.has('left');
        const hasBottomCladding = cell.claddingEdges.has('bottom') || grid[row+1][col].claddingEdges.has('top');
        
        if (hasRightCladding && hasBottomCladding) {
          const cornerKey = `${row},${col}-right-bottom`;
          if (!processedCornerConnections.has(cornerKey)) {
            connections.cornerConnectors++;
            processedCornerConnections.add(cornerKey);
          }
        }
      }
      if (adjacentStates.bottom && adjacentStates.left) {
        const hasBottomCladding = cell.claddingEdges.has('bottom') || grid[row+1][col].claddingEdges.has('top');
        const hasLeftCladding = cell.claddingEdges.has('left') || grid[row][col-1].claddingEdges.has('right');
        
        if (hasBottomCladding && hasLeftCladding) {
          const cornerKey = `${row},${col}-bottom-left`;
          if (!processedCornerConnections.has(cornerKey)) {
            connections.cornerConnectors++;
            processedCornerConnections.add(cornerKey);
          }
        }
      }
      if (adjacentStates.left && adjacentStates.top) {
        const hasLeftCladding = cell.claddingEdges.has('left') || grid[row][col-1].claddingEdges.has('right');
        const hasTopCladding = cell.claddingEdges.has('top') || grid[row-1][col].claddingEdges.has('bottom');
        
        if (hasLeftCladding && hasTopCladding) {
          const cornerKey = `${row},${col}-left-top`;
          if (!processedCornerConnections.has(cornerKey)) {
            connections.cornerConnectors++;
            processedCornerConnections.add(cornerKey);
          }
        }
      }
    }
  }

  return connections;
};
