# Technical Context

## Core Stack
_Main technologies used_

## Core Implementation

**Grid System**:
- 3x3 matrix using Immutable.js Record
- Each cell tracks:
  - Occupied state
  - Cube type (regular/extra-tall)
  - Connection bitmask

**Dependencies**:
- React 18.2+ (State management)
- Immutable 4.3+ (Grid operations)
- Lodash 4.17+ (Connection analysis)

**Key Functions**:
```typescript
// calculationUtils.ts
export function calculateConnections(
  grid: GridMatrix,
  position: [number, number]
): ConnectionAnalysis {
  // Returns straight couplings and corner connectors needed
}
```

## Development Setup
_Env variables, dependencies_

## Constraints
_Technical limitations/requirements_
