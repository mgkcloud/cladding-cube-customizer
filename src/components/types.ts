export interface GridCell {
  hasCube: boolean;
  claddingEdges: Set<'top' | 'right' | 'bottom' | 'left'>;
}

export interface Requirements {
  fourPackRegular: number;
  fourPackExtraTall: number;
  twoPackRegular: number;
  twoPackExtraTall: number;
  leftPanels: number;
  rightPanels: number;
  sidePanels: number;
  cornerConnectors: number;
  straightCouplings: number;
}