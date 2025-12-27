import { runCadence } from '../src';

describe('Cadence safety / negative tests', () => {

  test('fails on unknown identifier', () => {
    const program = `
      score + secret
    `;

    expect(() =>
      runCadence(program, { score: 10 })
    ).toThrow(/Unknown identifier/);
  });

  test('cannot access global objects', () => {
    expect(() =>
      runCadence('Math', {})
    ).toThrow(/Unknown identifier/);
  });

  test('cannot access process', () => {
    expect(() =>
      runCadence('process', {})
    ).toThrow(/Unknown identifier/);
  });

  test('cannot access globalThis', () => {
    expect(() =>
      runCadence('globalThis', {})
    ).toThrow(/Unknown identifier/);
  });

  test('cannot call non-whitelisted functions', () => {
    const program = `
      eval("2 + 2")
    `;

    expect(() =>
      runCadence(program, {})
    ).toThrow(/Unknown function/);
  });

  test('cannot call Function constructor', () => {
    expect(() =>
      runCadence('Function("return 5")()', {})
    ).toThrow();
  });

  test('cannot access object properties', () => {
    const program = `
      score.toString()
    `;

    expect(() =>
      runCadence(program, { score: 10 })
    ).toThrow();
  });

  test('cannot mutate arrays', () => {
    const program = `
      damage.push(10)
    `;

    expect(() =>
      runCadence(program, { damage: [1, 2, 3] })
    ).toThrow();
  });

  test('input context is immutable (shadowing does not mutate input)', () => {
    const input = { score: 10 };

    const program = `
      score + 5 [score];
      score
    `;

    const result = runCadence(program, input);

    expect(result).toBe(15);
    expect(input.score).toBe(10);
  });

  test('fails on malformed conditional (missing else)', () => {
    const program = `
      score > 10 ? "high"
    `;

    expect(() =>
      runCadence(program, { score: 12 })
    ).toThrow();
  });

  test('fails on unbalanced parentheses', () => {
    const program = `
      (score + 5
    `;

    expect(() =>
      runCadence(program, { score: 10 })
    ).toThrow();
  });

  test('fails when helper receives invalid argument type', () => {
    const program = `
      sum(score)
    `;

    expect(() =>
      runCadence(program, { score: 10 })
    ).toThrow();
  });

  test('string content is not executed or re-parsed', () => {
    const program = `
      "score + 100"
    `;

    const result = runCadence(program, { score: 1 });

    expect(result).toBe('score + 100');
  });

  test('fails on excessively deep expressions', () => {
    const program = '('.repeat(10000) + '1' + ')'.repeat(10000);

    expect(() =>
      runCadence(program, {})
    ).toThrow();
  });

});
