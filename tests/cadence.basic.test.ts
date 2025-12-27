import { runCadence } from '../src';

test('basic example with variables and sign', () => {
  const program = `
    floor((score - 10) / 2) [modifier];
    modifier < 0 ? "-" : "+" [sign];
    sign + abs(modifier)
  `;
  const result = runCadence(program, { score: 14 });
  expect(result).toBe('+2');
});
