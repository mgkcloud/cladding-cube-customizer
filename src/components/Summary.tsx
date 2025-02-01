import React from 'react';
import { Button } from '@/components/ui/button';
import { Requirements } from './FoodcubeConfigurator';

interface SummaryProps {
  requirements: Requirements;
  onSelect: () => void;
}

export const Summary: React.FC<SummaryProps> = ({ requirements, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Required Components</h3>
      
      <div className="space-y-2 mb-6">
        {requirements.fourPackRegular > 0 && (
          <div>4 Pack Regular (500mm) x {requirements.fourPackRegular}</div>
        )}
        {requirements.fourPackExtraTall > 0 && (
          <div>4 Pack Extra Tall (700mm) x {requirements.fourPackExtraTall}</div>
        )}
        {requirements.twoPackRegular > 0 && (
          <div>2 Pack Regular (500mm) x {requirements.twoPackRegular}</div>
        )}
        {requirements.twoPackExtraTall > 0 && (
          <div>2 Pack Extra Tall (700mm) x {requirements.twoPackExtraTall}</div>
        )}
        {requirements.cornerConnectors > 0 && (
          <div>Corner Connectors x {requirements.cornerConnectors}</div>
        )}
        {requirements.straightCouplings > 0 && (
          <div>Straight Couplings x {requirements.straightCouplings}</div>
        )}
      </div>

      <Button 
        className="w-full"
        onClick={onSelect}
      >
        Select Components
      </Button>
    </div>
  );
};