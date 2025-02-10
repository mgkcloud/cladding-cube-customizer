import { useState, useCallback, useEffect } from 'react';
import { GridCell, Requirements } from '@/components/types';
import { calculateRequirements, hasAdjacentCube } from '@/utils/calculationUtils';

const GRID_SIZE = 3;

const initializeGrid = (): GridCell[][] => {
  return Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      hasCube: false,
      claddingEdges: new Set(),
      connections: {
        entry: null,
        exit: null
      }
    }))
  );
};

const useGridState = () => {
  const [grid, setGrid] = useState<GridCell[][]>(initializeGrid);
  const [requirements, setRequirements] = useState<Requirements>({
    fourPackRegular: 0,
    fourPackExtraTall: 0,
    twoPackRegular: 0,
    twoPackExtraTall: 0,
    leftPanels: 0,
    rightPanels: 0,
    sidePanels: 0,
    cornerConnectors: 0,
    straightCouplings: 0
  });

  const toggleCell = useCallback((row: number, col: number) => {
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(cell => ({ 
        ...cell, 
        claddingEdges: new Set(cell.claddingEdges),
        connections: { ...cell.connections }
      })));
      
      // If we're adding a cube
      if (!prev[row][col].hasCube) {
        // Add cladding to all exposed edges
        const exposedEdges = new Set<'N' | 'E' | 'S' | 'W'>();
        ['N', 'E', 'S', 'W'].forEach(edge => {
          if (!hasAdjacentCube(prev, row, col, edge)) {
            exposedEdges.add(edge as 'N' | 'E' | 'S' | 'W');
          }
        });
        
        newGrid[row][col] = {
          hasCube: true,
          claddingEdges: exposedEdges,
          connections: {
            entry: null,
            exit: null
          }
        };

        // Update connections for adjacent cubes
        const adjacentPositions = [
          { r: row-1, c: col, direction: 'S' as const },
          { r: row+1, c: col, direction: 'N' as const },
          { r: row, c: col-1, direction: 'E' as const },
          { r: row, c: col+1, direction: 'W' as const }
        ];

        let connectedCubes = adjacentPositions.filter(({ r, c }) => 
          r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && newGrid[r][c].hasCube
        );

        // If exactly two adjacent cubes, set up connections
        if (connectedCubes.length === 2) {
          const [first, second] = connectedCubes;
          newGrid[row][col].connections = {
            entry: first.direction,
            exit: second.direction
          };
        }
      } else {
        // If removing a cube, update adjacent cubes' cladding and connections
        newGrid[row][col] = {
          hasCube: false,
          claddingEdges: new Set(),
          connections: {
            entry: null,
            exit: null
          }
        };

        // Update adjacent cubes to add cladding on the newly exposed sides
        const adjacentPositions = [
          { r: row-1, c: col, edge: 'S' as const },
          { r: row+1, c: col, edge: 'N' as const },
          { r: row, c: col-1, edge: 'E' as const },
          { r: row, c: col+1, edge: 'W' as const }
        ];

        adjacentPositions.forEach(({ r, c, edge }) => {
          if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && newGrid[r][c].hasCube) {
            newGrid[r][c].claddingEdges.add(edge);
            // Clear connections when a cube is removed
            newGrid[r][c].connections = {
              entry: null,
              exit: null
            };
          }
        });
      }
      return newGrid;
    });
  }, []);

  const toggleCladding = useCallback((row: number, col: number, edge: 'N' | 'E' | 'S' | 'W') => {
    setGrid(prev => {
      // Only allow toggling if the edge is exposed (no adjacent cube)
      if (hasAdjacentCube(prev, row, col, edge)) {
        return prev;
      }

      const newGrid = [...prev];
      newGrid[row] = [...prev[row]];
      const cell = { ...prev[row][col] };
      const newEdges = new Set(cell.claddingEdges);
      
      if (newEdges.has(edge)) {
        newEdges.delete(edge);
      } else {
        newEdges.add(edge);
      }
      
      cell.claddingEdges = newEdges;
      newGrid[row][col] = cell;
      return newGrid;
    });
  }, []);

  const applyPreset = useCallback((preset: GridCell[][]) => {
    if (!Array.isArray(preset) || !preset.every(row => Array.isArray(row))) {
      console.error('Invalid preset format:', preset);
      return;
    }

    // Create a deep copy of the preset grid
    const newGrid: GridCell[][] = preset.map(row => 
      row.map(cell => ({
        hasCube: cell.hasCube,
        claddingEdges: new Set(cell.claddingEdges),
        connections: {
          entry: cell.connections?.entry || null,
          exit: cell.connections?.exit || null
        }
      }))
    );

    setGrid(newGrid);
  }, []);

  // Update requirements whenever grid changes
  useEffect(() => {
    const newRequirements = calculateRequirements(grid);
    setRequirements(newRequirements);
  }, [grid]);

  return {
    grid,
    requirements,
    toggleCell,
    toggleCladding,
    applyPreset
  };
};

export default useGridState;
