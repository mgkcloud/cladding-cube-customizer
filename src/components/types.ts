export interface GridCell {
  hasCube: boolean;
  isExtraTall: boolean;
}

export interface Requirements {
  fourPackRegular: number;
  fourPackExtraTall: number;
  twoPackRegular: number;
  twoPackExtraTall: number;
  cornerConnectors: number;
  straightCouplings: number;
}