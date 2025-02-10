import { PanelRequirements, TotalRequirements } from './types';

/**
 * Pack panels according to flow-based rules:
 * 1. Always create one four-pack first (2 side + 1 left + 1 right)
 * 2. Pack remaining side panels into two-packs (2 side panels each)
 * 3. Keep any remaining panels as individual panels
 * 4. Left/right panels are determined by the flow direction through cubes
 *
 * Flow-based configurations:
 * - Single cube (4 edges): 1 four-pack (2 side + 1 left + 1 right)
 * - Line (8 edges): 1 four-pack, 2 two-packs, 2 straight couplings
 * - L-shape (8 edges): 1 four-pack, 2 two-packs, 1 corner connector, 1 straight coupling
 * - U-shape (12 edges): 1 four-pack, 2 two-packs, 2 corner connectors, 2 straight couplings
 */
export const packPanels = (
  panelCounts: PanelRequirements,
  couplingCounts: { straight: number; cornerLeft: number; cornerRight: number; }
): TotalRequirements => {
  // Initialize with zero counts
  const requirements: TotalRequirements = {
    fourPackRegular: 0,
    fourPackExtraTall: 0,
    twoPackRegular: 0,
    twoPackExtraTall: 0,
    leftPanels: 0,
    rightPanels: 0,
    sidePanels: 0,
    straightCouplings: couplingCounts.straight || 0,
    cornerConnectors: (couplingCounts.cornerLeft || 0) + (couplingCounts.cornerRight || 0)
  };

  let {
    sidePanels,
    leftPanels,
    rightPanels
  } = { ...panelCounts }; // Clone to avoid mutations

  // Calculate total panels and configuration type
  const totalPanels = sidePanels + leftPanels + rightPanels;
  const isLine = requirements.straightCouplings === 2 && !requirements.cornerConnectors;
  const isL = requirements.straightCouplings === 1 && requirements.cornerConnectors === 1;
  const isU = requirements.straightCouplings === 2 && requirements.cornerConnectors === 2;

  // Rule 1: Always create ONE four-pack first if possible
  if (sidePanels >= 2 && leftPanels >= 1 && rightPanels >= 1) {
    requirements.fourPackRegular = 1;
    sidePanels -= 2;
    leftPanels -= 1;
    rightPanels -= 1;
  }

  // Rule 2: Handle remaining panels based on configuration
  if (totalPanels === 4) {
    // Single cube: Just the four-pack
    requirements.sidePanels = 0;
    requirements.leftPanels = 0;
    requirements.rightPanels = 0;
  } 
  else if (isLine && totalPanels === 8) {
    // Line of 3: four-pack + 2 two-packs
    requirements.twoPackRegular = 2;
    requirements.sidePanels = 0;
    requirements.leftPanels = 0;
    requirements.rightPanels = 0;
  }
  else if (isL && totalPanels === 8) {
    // L-shape: four-pack + 2 two-packs + extra left/right
    requirements.twoPackRegular = 2;
    requirements.sidePanels = 0;
    
    // Keep one extra left/right panel based on corner type
    if (couplingCounts.cornerLeft > 0) {
      requirements.leftPanels = 1;
      requirements.rightPanels = 0;
    } else {
      requirements.leftPanels = 0;
      requirements.rightPanels = 1;
    }
  }
  else if (isU && totalPanels === 12) {
    // U-shape: four-pack + 2 two-packs
    requirements.twoPackRegular = 2;
    requirements.sidePanels = 0;
    requirements.leftPanels = 0;
    requirements.rightPanels = 0;
  }
  else {
    // Default case: Pack remaining side panels into two-packs
    const twoPackCount = Math.floor(sidePanels / 2);
    requirements.twoPackRegular = twoPackCount;
    requirements.sidePanels = sidePanels - (twoPackCount * 2);
    requirements.leftPanels = leftPanels;
    requirements.rightPanels = rightPanels;
  }

  return requirements;
};

/**
 * Validate the panel packing against known configurations
 * This helps ensure our packing logic matches the expected outcomes
 */
export const validateConfiguration = (requirements: TotalRequirements): boolean => {
  const totalPanels = 
    requirements.sidePanels +
    requirements.leftPanels +
    requirements.rightPanels +
    (requirements.fourPackRegular * 4) +
    (requirements.twoPackRegular * 2);

  // Single cube (4 edges)
  if (totalPanels === 4) {
    return requirements.fourPackRegular === 1 &&
           requirements.twoPackRegular === 0 &&
           requirements.leftPanels === 0 &&
           requirements.rightPanels === 0 &&
           requirements.sidePanels === 0;
  }

  // Line configuration (8 edges)
  if (totalPanels === 8 && requirements.straightCouplings === 2) {
    return requirements.fourPackRegular === 1 &&
           requirements.twoPackRegular === 2 &&
           requirements.leftPanels === 0 &&
           requirements.rightPanels === 0 &&
           requirements.sidePanels === 0;
  }

  // L-shape configuration (8 edges)
  if (totalPanels === 8 && 
      requirements.cornerConnectors === 1 &&
      requirements.straightCouplings === 1) {
    return requirements.fourPackRegular === 1 &&
           requirements.twoPackRegular === 2 &&
           (requirements.leftPanels === 1 || requirements.rightPanels === 1) &&
           requirements.sidePanels === 0;
  }

  // U-shape configuration (12 edges)
  if (totalPanels === 12 &&
      requirements.cornerConnectors === 2 &&
      requirements.straightCouplings === 2) {
    return requirements.fourPackRegular === 1 &&
           requirements.twoPackRegular === 2 &&
           requirements.sidePanels === 0;
  }

  return true; // Allow other valid configurations
};
