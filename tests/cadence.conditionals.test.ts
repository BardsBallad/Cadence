import { runCadence } from '../src';

describe('conditionals', () => {
  it('evaluates ternary', () => {
    expect(runCadence('true ? 1 : 2', {})).toBe(1);
    expect(runCadence('false ? 1 : 2', {})).toBe(2);
  });

  it('evaluates logical and/or with short-circuit', () => {
    expect(runCadence('1 && 2', {})).toBe(2);
    expect(runCadence('0 || 5', {})).toBe(5);
  });
});
