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
            className={cn(
              'absolute bg-primary/20 pointer-events-auto hover:bg-primary/40 cursor-pointer',
              {
                'bg-destructive/40 hover:bg-destructive/60': cell.claddingEdges.has(edge),
                'w-1/3 h-1': ['top', 'bottom'].includes(edge),
                'h-1/3 w-1': ['left', 'right'].includes(edge),
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
