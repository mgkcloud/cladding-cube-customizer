import React from 'react';
import { HelpTooltip } from './HelpTooltip';
import { Grid } from './Grid';
import { PresetConfigs } from './PresetConfigs';
import { Summary } from './Summary';
import useGridState from '@/hooks/useGridState';

interface FoodcubeConfiguratorProps {
  variants: Record<string, any>;
  onUpdate: (selections: Record<string, number>) => void;
}

export const FoodcubeConfigurator: React.FC<FoodcubeConfiguratorProps> = ({ variants, onUpdate }) => {
  console.log('FoodcubeConfigurator received variants:', variants);
  const { grid, requirements, toggleCell, toggleCladding, applyPreset } = useGridState();

  React.useEffect(() => {
    const selections = {
      fourPackRegular: requirements.fourPackRegular,
      fourPackExtraTall: requirements.fourPackExtraTall,
      twoPackRegular: requirements.twoPackRegular,
      twoPackExtraTall: requirements.twoPackExtraTall,
      leftPanels: requirements.leftPanels,
      rightPanels: requirements.rightPanels,
      sidePanels: requirements.sidePanels,
      cornerConnectors: requirements.cornerConnectors,
      straightCouplings: requirements.straightCouplings
    };

    onUpdate(selections);
  }, [requirements, onUpdate]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <HelpTooltip />
      <div className="mb-6">
        <h2 className="text-3xl p-4 m-auto text-center font-bold">Cladding Configurator</h2>
        <div className='flex justify-center items-center gap-2'>
            
            <h4 className="text-sm my-2 text-center font-semibold">Preset Configurations</h4>
            <PresetConfigs onApply={applyPreset} />


          </div>
      </div>
      
      <div className="gap-6 max-w-lg flex justify-center m-auto">
        <div className="w-2/3">
          <Grid 
            grid={grid} 
            onToggleCell={toggleCell} 
            onToggleCladding={toggleCladding} 
          />
        
        </div>
        <div className="w-1/3">
          <Summary requirements={requirements} variants={variants} />
        </div>
      </div>
    </div>
  );
};

export default FoodcubeConfigurator;