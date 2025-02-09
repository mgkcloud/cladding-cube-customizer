import { packPanels } from './panelPacker';

describe('packPanels', () => {
  // Truth: For a single cube with all edges(4 edges) cladded
  test('single cube with all edges cladded', () => {
    const counts = {
      sidePanels: 2,  // top and bottom
      leftPanels: 1,  // left
      rightPanels: 1  // right
    };

    const result = packPanels(counts);
    expect(result).toEqual({
      fourPackRegular: 1,     // Uses 2 side + 1 left + 1 right
      fourPackExtraTall: 0,
      twoPackRegular: 0,
      twoPackExtraTall: 0,
      leftPanels: 0,
      rightPanels: 0,
      sidePanels: 0
    });
  });

  // Truth: For three cubes in a line(8 edges)
  test('three cubes in a line with cladding', () => {
    const counts = {
      sidePanels: 6,  // 3 pairs of top/bottom
      leftPanels: 1,  // leftmost cube
      rightPanels: 1  // rightmost cube
    };

    const result = packPanels(counts);
    expect(result).toEqual({
      fourPackRegular: 1,     // Uses 2 side + 1 left + 1 right
      fourPackExtraTall: 0,
      twoPackRegular: 2,     // Uses remaining 4 side panels (2 two-packs)
      twoPackExtraTall: 0,
      leftPanels: 0,
      rightPanels: 0,
      sidePanels: 0
    });
  });

  // Truth: For L-shaped configuration(8 edges)
  test('L-shaped configuration with cladding', () => {
    const counts = {
      sidePanels: 5,  // 2 top + 2 bottom + 1 extra side
      leftPanels: 1,  // 1 left edge
      rightPanels: 1  // 1 right edge
    };

    const result = packPanels(counts);
    expect(result).toEqual({
      fourPackRegular: 1,     // Uses 2 side + 1 left + 1 right
      fourPackExtraTall: 0,
      twoPackRegular: 1,     // Uses 2 more side panels
      twoPackExtraTall: 0,
      leftPanels: 0,
      rightPanels: 0,
      sidePanels: 1          // 1 extra side panel unused
    });
  });

  // Truth: For U-shaped configuration(12 edges)
  test('U-shaped configuration with cladding', () => {
    const counts = {
      sidePanels: 6,  // 3 pairs of top/bottom
      leftPanels: 1,  // 1 left edge
      rightPanels: 1  // 1 right edge
    };

    const result = packPanels(counts);
    expect(result).toEqual({
      fourPackRegular: 1,     // Uses 2 side + 1 left + 1 right
      fourPackExtraTall: 0,
      twoPackRegular: 2,     // Uses remaining 4 side panels
      twoPackExtraTall: 0,
      leftPanels: 0,
      rightPanels: 0,
      sidePanels: 0
    });
  });
});
