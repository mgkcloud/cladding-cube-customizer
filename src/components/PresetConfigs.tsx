import React from 'react';
import { Button } from '@/components/ui/button';
import { GridCell } from './types';

const createEmptyCell = (): GridCell => ({
  hasCube: false,
  claddingEdges: new Set()
});

const createCubeCell = (): GridCell => ({
  hasCube: true,
  claddingEdges: new Set()
});

const PRESETS = {
  straight: Array(3).fill(null).map(() =>
    Array(3).fill(null).map((_, j) => j === 1 ? createCubeCell() : createEmptyCell())
  ),
  L: Array(3).fill(null).map((_, i) =>
    Array(3).fill(null).map((_, j) => (i === 1 && j <= 1) || (i === 2 && j === 1) ? createCubeCell() : createEmptyCell())
  ),
  U: Array(3).fill(null).map((_, i) =>
    Array(3).fill(null).map((_, j) => (i === 2) || (i === 1 && (j === 0 || j === 2)) ? createCubeCell() : createEmptyCell())
  )
} as const;

interface PresetConfigsProps {
  onApply: (preset: GridCell[][]) => void;
}

export const PresetConfigs: React.FC<PresetConfigsProps> = ({ onApply }) => {
  return (
    <div className="flex gap-4 mb-4">
      <Button 
        variant="outline"
        onClick={() => onApply(PRESETS.straight)}
      >
        Straight (3x1)
      </Button>
      <Button 
        variant="outline"
        onClick={() => onApply(PRESETS.L)}
      >
        L-Shape
      </Button>
      <Button 
        variant="outline"
        onClick={() => onApply(PRESETS.U)}
      >
        U-Shape
      </Button>
    </div>
  );
};