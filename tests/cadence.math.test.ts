import { runCadence } from '../src';

describe('math operations', () => {
  it('handles precedence and grouping', () => {
    const r1 = runCadence('1 + 2 * 3', {});
    const r2 = runCadence('(1 + 2) * 3', {});
    const r3 = runCadence('2 ^ 3 ^ 2', {}); // 2^(3^2) = 512
    expect(r1).toBe(7);
    expect(r2).toBe(9);
    expect(r3).toBe(512);
  });

  it('supports comparisons and equality', () => {
    expect(runCadence('3 < 4', {})).toBe(true);
    expect(runCadence('3 >= 3', {})).toBe(true);
    expect(runCadence('3 == 3', {})).toBe(true);
    expect(runCadence('3 != 4', {})).toBe(true);
  });

  it('unary plus/minus', () => {
    expect(runCadence('-5 + +2', {})).toBe(-3);
  });
});
