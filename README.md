# Cadence

A safe, deterministic expression engine for user-generated content.

Cadence is a lightweight, sandboxed expression evaluator designed for TTRPG systems and other applications that need to safely execute user-defined calculations without the risks of arbitrary code execution.

## Features

- **Deterministic Evaluation**: Consistent results for the same inputs every time
- **Safe Sandbox**: No file system access, no arbitrary function execution, no side effects
- **Type-Safe**: Built with TypeScript for robust type checking
- **Array Operations**: Built-in helpers for sum, count, min, max, avg, any, all
- **Math Functions**: Support for floor, ceil, abs, round, and more
- **Conditional Logic**: Ternary operators and boolean operations
- **Variable Binding**: Assign intermediate results with named variables

## Installation

```bash
npm install @bardsballad/cadence
```

## Quick Start

```typescript
import { runCadence } from '@bardsballad/cadence';

const program = `
  floor((score - 10) / 2) [modifier];
  modifier < 0 ? "-" : "+" [sign];
  sign + abs(modifier)
`;

const result = runCadence(program, { score: 14 });
console.log(result); // "+2"
```

## Syntax

### Basic Expressions

```typescript
// Arithmetic
2 + 3 * 4
10 - 5
20 / 4
3 * 3

// Comparison
x > 5
y <= 10
a === b
c !== d

// Boolean Logic
true && false
true || false
!condition
```

### Variable Binding

Use square brackets to bind intermediate results:

```typescript
score - 10 [adjusted];
adjusted / 2 [halved];
floor(halved)
```

### Conditionals

Ternary operator for conditional evaluation:

```typescript
x > 5 ? "big" : "small"
score >= 20 ? 10 : score >= 10 ? 5 : 0
```

### Array Operations

```typescript
// Available helpers
sum([1, 2, 3])              // 6
count([a, b, c])            // 3
min([5, 2, 8])              // 2
max([5, 2, 8])              // 8
avg([10, 20, 30])           // 20
any([false, false, true])   // true
all([true, true, false])    // false
```

### Math Functions

```typescript
floor(3.7)      // 3
ceil(3.2)       // 4
round(3.5)      // 4 (banker's rounding)
abs(-5)         // 5
```

## API

### `runCadence(program: string, input: Record<string, any>): any`

Executes a Cadence program with the provided input variables.

**Parameters:**
- `program`: The expression string to evaluate
- `input`: An object containing variables available to the program

**Returns:** The result of evaluating the final expression

**Example:**

```typescript
const damage = runCadence(
  `base_damage + (strength_modifier > 0 ? strength_modifier : 0)`,
  { base_damage: 8, strength_modifier: 3 }
); // 11
```

## Examples

### D&D Ability Modifier Calculation

```typescript
import { runCadence } from '@bardsballad/cadence';

const modifier = runCadence(
  `floor((ability_score - 10) / 2)`,
  { ability_score: 16 }
); // 3
```

### Damage Calculation with Modifiers

```typescript
const damage = runCadence(
  `base_damage [d];
   d + strength_mod + (is_critical ? d : 0)`,
  { base_damage: 6, strength_mod: 2, is_critical: true }
); // 14
```

### Complex Conditional Pricing

```typescript
const price = runCadence(
  `base_price [b];
   quantity > 100 ? b * 0.9 : quantity > 10 ? b * 0.95 : b`,
  { base_price: 100, quantity: 50 }
); // 95
```

## Safety

Cadence enforces strict safety boundaries:

- **No Global Access**: Variables must be explicitly passed via the `input` object
- **No Function Definition**: Users cannot define custom functions
- **No Mutations**: All operations are pure and side-effect free
- **No External Calls**: No file system, network, or environment access
- **Type Validation**: Helper functions validate argument types

This makes Cadence suitable for user-facing expression editors where you need to prevent malicious or accidental code execution.

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## License

MIT

## Contributing

Contributions welcome! Please ensure all tests pass before submitting pull requests.

```bash
npm test
npm run build
```
