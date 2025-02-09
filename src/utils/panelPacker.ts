import { PanelCounts } from './panelCounter';

export interface PackedPanels {
  fourPackRegular: number;
  fourPackExtraTall: number;
  twoPackRegular: number;
  twoPackExtraTall: number;
  leftPanels: number;
  rightPanels: number;
  sidePanels: number;
}

export const packPanels = (counts: PanelCounts): PackedPanels => {
  const packed: PackedPanels = {
    fourPackRegular: 0,
    fourPackExtraTall: 0,
    twoPackRegular: 0,
    twoPackExtraTall: 0,
    leftPanels: 0,
    rightPanels: 0,
    sidePanels: 0
  };

  // First calculate how many 4-packs we can make
  // Each 4-pack needs: 2 side panels + 1 left + 1 right
  packed.fourPackRegular = Math.min(
    Math.floor(counts.sidePanels / 2),
    counts.leftPanels,
    counts.rightPanels
  );

  // Calculate remaining panels after using 4-packs
  let remainingSidePanels = counts.sidePanels - (packed.fourPackRegular * 2);
  let remainingLeftPanels = counts.leftPanels - packed.fourPackRegular;
  let remainingRightPanels = counts.rightPanels - packed.fourPackRegular;

  // Pack remaining side panels into 2-packs
  packed.twoPackRegular = Math.floor(remainingSidePanels / 2);
  remainingSidePanels -= packed.twoPackRegular * 2;

  // Store any remaining individual panels
  packed.sidePanels = remainingSidePanels;
  packed.leftPanels = remainingLeftPanels;
  packed.rightPanels = remainingRightPanels;

  return packed;
};
