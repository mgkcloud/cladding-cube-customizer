import { render, screen, fireEvent } from '@testing-library/react';
import { FoodcubeConfigurator } from '../FoodcubeConfigurator';

const mockVariants = {
  fourPackRegular: {
    name: "4-Pack Regular",
    price: 29.99,
    description: "Regular height 4-pack of panels"
  },
  cornerConnectors: {
    name: "Corner Connector",
    price: 4.99,
    description: "Corner connector for joining panels"
  },
  straightCouplings: {
    name: "Straight Coupling",
    price: 3.99,
    description: "Straight coupling for joining panels"
  }
};

describe('FoodcubeConfigurator', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  test('renders with initial empty state', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Cladding Configurator')).toBeInTheDocument();
    expect(screen.getByText('Tap grid to place Foodcube')).toBeInTheDocument();
  });

  test('places cube and toggles all cladding', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    
    // Click the center cell to place a cube
    const cells = screen.getAllByTestId('grid-cell');
    const centerCell = cells[4]; // Center cell in 3x3 grid
    fireEvent.click(centerCell);

    // Toggle all cladding edges
    const claddingEdges = screen.getAllByTestId('cladding-edge');
    claddingEdges.forEach(edge => {
      fireEvent.click(edge);
    });

    // For a single cube with all edges cladded, we should get:
    // 1 four-pack (2 side + 1 left + 1 right)
    // No connectors needed
    expect(mockOnUpdate).toHaveBeenLastCalledWith(expect.objectContaining({
      fourPackRegular: 1,
      straightCouplings: 0,
      cornerConnectors: 0
    }));
  });

  test('updates requirements when toggling cladding', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    
    // Click the center cell to place a cube
    const cells = screen.getAllByTestId('grid-cell');
    const centerCell = cells[4];
    fireEvent.click(centerCell);

    // Get initial update values
    const initialCall = mockOnUpdate.mock.calls[0][0];

    // Toggle all available cladding edges
    const claddingEdges = screen.getAllByTestId('cladding-edge');
    claddingEdges.forEach(edge => {
      fireEvent.click(edge);
    });

    // Get final update values
    const finalCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0];

    // Expect more panels/connectors after adding cladding
    const initialTotal = initialCall.straightCouplings + initialCall.cornerConnectors;
    const finalTotal = finalCall.straightCouplings + finalCall.cornerConnectors;
    expect(finalTotal).toBeGreaterThan(initialTotal);
  });

  test('correctly packs panels into 4-packs', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    
    // Create a 2x2 square of cubes
    const cells = screen.getAllByTestId('grid-cell');
    fireEvent.click(cells[4]);
    fireEvent.click(cells[5]);
    fireEvent.click(cells[7]);
    fireEvent.click(cells[8]);

    // Add cladding to all outer edges
    const claddingEdges = screen.getAllByTestId('cladding-edge');
    claddingEdges.forEach(edge => {
      fireEvent.click(edge);
    });

    // Get final requirements
    const finalCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0];

    // Verify we have some panels and they are packed
    expect(finalCall.fourPackRegular).toBeGreaterThan(0);
    expect(finalCall.sidePanels).toBe(0);
    expect(finalCall.leftPanels).toBe(0);
    expect(finalCall.rightPanels).toBe(0);
  });

  test('handles adjacent cubes correctly', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    
    // Place two adjacent cubes
    const cells = screen.getAllByTestId('grid-cell');
    fireEvent.click(cells[4]);
    fireEvent.click(cells[5]);

    // Add cladding to all exposed edges
    const claddingEdges = screen.getAllByTestId('cladding-edge');
    claddingEdges.forEach(edge => {
      fireEvent.click(edge);
    });

    // Get requirements
    const requirements = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0];

    // Should not count shared edge for couplings
    expect(requirements.straightCouplings).toBeGreaterThan(0); // Should have some straight couplings
    expect(requirements.cornerConnectors).toBeGreaterThan(0); // Should have some corner connectors
  });

  test('adds cladding to newly exposed sides when removing cube', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    
    // Place two adjacent cubes
    const cells = screen.getAllByTestId('grid-cell');
    const centerCell = cells[4]; // Center cell
    const rightCell = cells[5];  // Right cell
    
    // Add both cubes
    fireEvent.click(centerCell);
    fireEvent.click(rightCell);
    
    // Initial cladding edges (should not include shared edge)
    let claddingEdges = screen.getAllByTestId('cladding-edge');
    const initialEdgeCount = claddingEdges.length;
    
    // Remove right cube
    fireEvent.click(rightCell);
    
    // Get updated cladding edges
    claddingEdges = screen.getAllByTestId('cladding-edge');
    
    // Should have one more edge (the newly exposed right side)
    expect(claddingEdges.length).toBe(initialEdgeCount + 1);
    
    // Verify requirements were updated
    const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0];
    expect(lastCall.straightCouplings + lastCall.cornerConnectors).toBeGreaterThan(0);
  });

  test('removes cladding when cube is removed', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    
    // Place a cube and add cladding
    const cells = screen.getAllByTestId('grid-cell');
    fireEvent.click(cells[4]);
    
    const claddingEdges = screen.getAllByTestId('cladding-edge');
    claddingEdges.forEach(edge => {
      fireEvent.click(edge);
    });

    // Get requirements with cladding
    const withCladding = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0];

    // Verify we have some cladding
    expect(withCladding.straightCouplings).toBeGreaterThan(0);

    // Remove the cube
    fireEvent.click(cells[4]);

    // Get final requirements
    const finalCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0];

    // All requirements should be zero
    expect(finalCall.straightCouplings).toBe(0);
    expect(finalCall.cornerConnectors).toBe(0);
  });

  test('straight line preset (3 cubes) gives correct requirements', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    
    // Apply straight line preset
    fireEvent.click(screen.getByText('Straight (3x1)'));

    // For three cubes in a line with all edges cladded, we should get:
    // 1 four-pack (2 side + 1 left + 1 right)
    // 2 two-packs (4 sides)
    // 2 straight couplings
    expect(mockOnUpdate).toHaveBeenLastCalledWith({
      fourPackRegular: 1,
      fourPackExtraTall: 0,
      twoPackRegular: 2,
      twoPackExtraTall: 0,
      straightCouplings: 2,  // Two couplings for three cubes in a line
      cornerConnectors: 0,
      leftPanels: 0,
      rightPanels: 0,
      sidePanels: 0
    });
  });

  test('L-shaped preset gives correct requirements', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    
    // Apply L-shape preset
    fireEvent.click(screen.getByText('L-Shape'));

    // For L-shaped configuration with all edges cladded, we should get:
    // - 1 four-pack (2 side + 1 right + 1 left)
    // - 2 two-packs (4 sides)
    // - 1 left panel (1 side)
    // - 1 corner connector
    // - 1 straight coupling
    expect(mockOnUpdate).toHaveBeenLastCalledWith({
      fourPackRegular: 1,
      fourPackExtraTall: 0,
      twoPackRegular: 2,
      twoPackExtraTall: 0,
      leftPanels: 1,
      rightPanels: 0,
      sidePanels: 1,
      cornerConnectors: 1,
      straightCouplings: 1
    });
  });

  test('U-shaped preset gives correct requirements', () => {
    render(<FoodcubeConfigurator variants={mockVariants} onUpdate={mockOnUpdate} />);
    
    // Apply U-shape preset
    fireEvent.click(screen.getByText('U-Shape'));

    // For U-shaped configuration with all edges cladded, we should get:
    // - 1 four-pack (2 side + 1 right + 1 left)
    // - 2 two-packs (4 sides)
    // - 2 corner connectors
    // - 2 straight couplings
    expect(mockOnUpdate).toHaveBeenLastCalledWith({
      fourPackRegular: 1,
      fourPackExtraTall: 0,
      twoPackRegular: 2,
      twoPackExtraTall: 0,
      leftPanels: 0,
      rightPanels: 0,
      sidePanels: 0,
      cornerConnectors: 2,
      straightCouplings: 2
    });
  });
});
