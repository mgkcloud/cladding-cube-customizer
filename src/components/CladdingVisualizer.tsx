import { cn } from '@/lib/utils';
import { GridCell } from './types';

type EdgeType = 'top' | 'right' | 'bottom' | 'left';

type CladdingVisualizerProps = {
  cell: GridCell;
  onToggle: (edge: EdgeType) => void;
  isEdgeExposed: Record<EdgeType, boolean>;
};

export const CladdingVisualizer = ({ cell, onToggle, isEdgeExposed }: CladdingVisualizerProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        {(['top', 'right', 'bottom', 'left'] as const).map((edge) => isEdgeExposed[edge] && (
          <div
            key={edge}
            data-testid="cladding-edge"
            data-edge={edge}
            className={cn(
              'absolute bg-white/40 pointer-events-auto hover:bg-white/90 cursor-pointer',
              {
                'bg-destructive/40 hover:bg-destructive/60': cell.claddingEdges.has(edge),
                'w-2/3 h-2': ['top', 'bottom'].includes(edge),
                'h-2/3 w-2': ['left', 'right'].includes(edge),
                'top-0': edge === 'top',
                'bottom-0': edge === 'bottom',
                'left-0': edge === 'left',
                'right-0': edge === 'right'
              }
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(edge);
            }}
          />
        ))}
      </div>
    </div>
  );
};
