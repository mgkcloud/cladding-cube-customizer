import { useState, useEffect } from 'react';
import { GridCell, Requirements } from '@/components/types';
import { calculateRequirements } from '@/utils/calculationUtils';
import { toast } from '@/hooks/use-toast';

export const useGridState = () => {
  const [grid, setGrid] = useState<GridCell[][]>(
    Array(3).fill(null).map(() => 
      Array(3).fill(null).map(() => ({ hasCube: false, isExtraTall: false }))
    )
  );
  
  const [requirements, setRequirements] = useState<Requirements>({
    fourPackRegular: 0,
    fourPackExtraTall: 0,
    twoPackRegular: 0,
    twoPackExtraTall: 0,
    cornerConnectors: 0,
    straightCouplings: 0
  });

  useEffect(() => {
    const newRequirements = calculateRequirements(grid);
    setRequirements(newRequirements);
    console.log('Updated requirements:', newRequirements);
  }, [grid]);

  const toggleCell = (row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col].hasCube = !newGrid[row][col].hasCube;
    setGrid(newGrid);
    console.log(`Toggled cell at ${row},${col}`);
  };

  const toggleHeight = (row: number, col: number) => {
    if (!grid[row][col].hasCube) return;
    const newGrid = [...grid];
    newGrid[row][col].isExtraTall = !newGrid[row][col].isExtraTall;
    setGrid(newGrid);
    console.log(`Toggled height at ${row},${col}`);
  };

  const applyPreset = (preset: 'straight' | 'L' | 'U') => {
    const newGrid = Array(3).fill(null).map(() => 
      Array(3).fill(null).map(() => ({ hasCube: false, isExtraTall: false }))
    );

    switch (preset) {
      case 'straight':
        // Place 3 cubes in a row
        for (let i = 0; i < 3; i++) {
          newGrid[1][i].hasCube = true;
        }
        break;
      case 'L':
        // Place cubes in L shape along the edges
        newGrid[0][0].hasCube = true;
        newGrid[1][0].hasCube = true;
        newGrid[2][0].hasCube = true;
        newGrid[2][1].hasCube = true;
        newGrid[2][2].hasCube = true;
        break;
      case 'U':
        // Place cubes in U shape along the edges
        newGrid[0][0].hasCube = true;
        newGrid[1][0].hasCube = true;
        newGrid[2][0].hasCube = true;
        newGrid[2][1].hasCube = true;
        newGrid[2][2].hasCube = true;
        newGrid[1][2].hasCube = true;
        newGrid[0][2].hasCube = true;
        break;
    }

    setGrid(newGrid);
    toast({
      title: "Configuration Applied",
      description: `Applied ${preset} configuration`
    });
    console.log(`Applied ${preset} configuration`);
  };

  return {
    grid,
    requirements,
    toggleCell,
    toggleHeight,
    applyPreset
  };
};