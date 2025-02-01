import React, { useState, useEffect } from 'react';
import { Grid } from './Grid';
import { PresetConfigs } from './PresetConfigs';
import { Summary } from './Summary';
import { calculateRequirements } from '../utils/calculationUtils';
import { toast } from '../hooks/use-toast';

export interface GridCell {
  hasCube: boolean;
  isExtraTall: boolean;
}

export interface Requirements {
  fourPackRegular: number;
  fourPackExtraTall: number;
  twoPackRegular: number;
  twoPackExtraTall: number;
  cornerConnectors: number;
  straightCouplings: number;
}

const FoodcubeConfigurator = () => {
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

  const handleSelect = () => {
    // Update Shopify variant quantities based on requirements
    const variants = {
      "44592702292276": requirements.fourPackRegular,
      "44592702390580": requirements.fourPackExtraTall,
      "44592713171252": requirements.twoPackRegular,
      "44592713204020": requirements.twoPackExtraTall,
      "46691832561972": requirements.cornerConnectors,
      "43711665668404": requirements.straightCouplings
    };

    Object.entries(variants).forEach(([variantId, quantity]) => {
      const variantElement = document.querySelector(
        `product-customizer-variant[variant-id="${variantId}"]`
      );
      if (variantElement) {
        const input = variantElement.querySelector('quantity-input input');
        if (input) {
          (input as HTMLInputElement).value = quantity.toString();
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });

    console.log('Updated variant quantities:', variants);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Foodcube Configurator</h2>
        <PresetConfigs onApply={applyPreset} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Grid 
            grid={grid} 
            onToggleCell={toggleCell} 
            onToggleHeight={toggleHeight} 
          />
        </div>
        <div>
          <Summary requirements={requirements} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
};

export default FoodcubeConfigurator;