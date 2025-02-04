import { useState, useCallback, useEffect } from 'react';
import { GridCell, Requirements } from '@/components/types';
import { calculateRequirements } from '@/utils/calculationUtils';

const GRID_SIZE = 3;

const initializeGrid = (): GridCell[][] => {
  return Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      hasCube: false,
      claddingEdges: new Set()
    }))
  );
};

const useGridState = () => {
  const [grid, setGrid] = useState<GridCell[][]>(initializeGrid);
  const [requirements, setRequirements] = useState<Requirements>({
    fourPackRegular: 0,
    twoPackRegular: 0,
    cornerConnectors: 0,
    straightCouplings: 0
  });

  const toggleCell = useCallback((row: number, col: number) => {
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[row] = [...prev[row]];
      newGrid[row][col] = {
        ...prev[row][col],
        hasCube: !prev[row][col].hasCube,
        claddingEdges: new Set()
      };
      return newGrid;
    });
  }, []);

  const toggleCladding = useCallback((row: number, col: number, edge: 'top' | 'right' | 'bottom' | 'left') => {
    setGrid(prev => {
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
    setGrid(preset.map(row => 
      row.map(cell => ({
        ...cell,
        claddingEdges: new Set()
      }))
    ));
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
