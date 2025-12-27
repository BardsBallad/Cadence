import { runCadence } from '../src';

describe('array helpers', () => {
  const arr = [1, 2, 3, 4];

  it('sum/count/avg/min/max', () => {
    expect(runCadence('sum(values)', { values: arr })).toBe(10);
    expect(runCadence('count(values)', { values: arr })).toBe(4);
    expect(runCadence('avg(values)', { values: arr })).toBe(2.5);
    expect(runCadence('min(values)', { values: arr })).toBe(1);
    expect(runCadence('max(values)', { values: arr })).toBe(4);
  });

  it('any/all', () => {
    expect(runCadence('any(values)', { values: [0, 0, 1] })).toBe(true);
    expect(runCadence('all(values)', { values: [1, 2, 3] })).toBe(true);
    expect(runCadence('all(values)', { values: [1, 0, 3] })).toBe(false);
  });
});
