import React from 'react';
import { Grid } from './Grid';
import { PresetConfigs } from './PresetConfigs';
import { Summary } from './Summary';
import useGridState from '@/hooks/useGridState';

interface FoodcubeConfiguratorProps {
  variants: Record<string, any>;
  onUpdate: (selections: Record<string, number>) => void;
}

export const FoodcubeConfigurator: React.FC<FoodcubeConfiguratorProps> = ({ variants, onUpdate }) => {
  const { grid, requirements, toggleCell, toggleCladding, applyPreset } = useGridState();

  const handleSelect = () => {
    const selections = {
      fourPackRegular: requirements.fourPackRegular,
      fourPackExtraTall: requirements.fourPackExtraTall,
      twoPackRegular: requirements.twoPackRegular,
      twoPackExtraTall: requirements.twoPackExtraTall,
      cornerConnectors: requirements.cornerConnectors,
      straightCouplings: requirements.straightCouplings
    };

    onUpdate(selections);
    console.log('Updated selections:', selections);
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
            onToggleCladding={toggleCladding} 
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