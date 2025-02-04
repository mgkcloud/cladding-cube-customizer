import React from 'react';
import { Grid } from './Grid';
import { PresetConfigs } from './PresetConfigs';
import { Summary } from './Summary';
import useGridState from '@/hooks/useGridState';

const FoodcubeConfigurator = () => {
  const { grid, requirements, toggleCell, toggleCladding, applyPreset } = useGridState();

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