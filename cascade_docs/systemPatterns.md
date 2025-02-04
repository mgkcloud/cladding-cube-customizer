# System Architecture

## Key Components
_Major subsystems/modules_

## Component Architecture

### FoodcubeConfigurator (TSX)
- Manages 3x3 grid state using Immutable.js Records
- Handles cube placement/removal via grid coordinates
- Integrates with Shopify Liquid through props:
  ```tsx
  interface ConfiguratorProps {
    variants: ShopifyVariants;
    onUpdate: (selections: ProductSelections) => void;
  }
  ```

### PresetConfigs (TSX)
- Predefined shape configurations:
  - Linear (3x1): Requires 2 straight couplings
  - L-Shape: Requires 1 corner + 3 straight couplings
  - U-Shape: Requires 2 corners + 5 straight couplings
- Validation rules prevent invalid overlaps

### CalculationUtils (TS)
- Directional enum (NORTH, EAST, SOUTH, WEST)
- Connection analysis algorithms
- Exposed side calculation matrix

## Data Flow
_How components interact_

## Design Decisions
_Architectural choices made_
