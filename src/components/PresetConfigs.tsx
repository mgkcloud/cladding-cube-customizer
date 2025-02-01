import React from 'react';
import { Button } from '@/components/ui/button';

interface PresetConfigsProps {
  onApply: (preset: 'straight' | 'L' | 'U') => void;
}

export const PresetConfigs: React.FC<PresetConfigsProps> = ({ onApply }) => {
  return (
    <div className="flex gap-4 mb-4">
      <Button 
        variant="outline"
        onClick={() => onApply('straight')}
      >
        Straight (3x1)
      </Button>
      <Button 
        variant="outline"
        onClick={() => onApply('L')}
      >
        L-Shape
      </Button>
      <Button 
        variant="outline"
        onClick={() => onApply('U')}
      >
        U-Shape
      </Button>
    </div>
  );
};