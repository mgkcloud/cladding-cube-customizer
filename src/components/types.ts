export interface GridCell {
  hasCube: boolean;
  claddingEdges: Set<'top' | 'right' | 'bottom' | 'left'>;
}

export interface Requirements {
  fourPackRegular: number;
  twoPackRegular: number;
  cornerConnectors: number;
  straightCouplings: number;
}