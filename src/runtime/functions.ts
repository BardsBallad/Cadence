export type HelperFn = (arg: any) => any;

function assertArray(name: string, v: any): asserts v is any[] {
  if (!Array.isArray(v)) throw new Error(`${name} expects array`);
}

function assertNumber(name: string, v: any): asserts v is number {
  if (typeof v !== 'number' || Number.isNaN(v)) throw new Error(`${name} expects number`);
}

export const helpers: Record<string, HelperFn> = {
  sum(arg: any) {
    assertArray('sum', arg);
    return arg.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
  },
  count(arg: any) {
    assertArray('count', arg);
    return arg.length;
  },
  min(arg: any) {
    assertArray('min', arg);
    if (arg.length === 0) return Infinity;
    return arg.reduce((m, v) => (typeof v === 'number' && v < m ? v : m), Infinity);
  },
  max(arg: any) {
    assertArray('max', arg);
    if (arg.length === 0) return -Infinity;
    return arg.reduce((m, v) => (typeof v === 'number' && v > m ? v : m), -Infinity);
  },
  avg(arg: any) {
    assertArray('avg', arg);
    if (arg.length === 0) return 0;
    const nums = arg.filter((v) => typeof v === 'number');
    if (nums.length === 0) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  },
  any(arg: any) {
    assertArray('any', arg);
    return arg.some((v) => Boolean(v));
  },
  all(arg: any) {
    assertArray('all', arg);
    return arg.every((v) => Boolean(v));
  },
  floor(arg: any) {
    assertNumber('floor', arg);
    return Math.floor(arg);
  },
  ceil(arg: any) {
    assertNumber('ceil', arg);
    return Math.ceil(arg);
  },
  abs(arg: any) {
    assertNumber('abs', arg);
    return Math.abs(arg);
  },
};

export function getHelper(name: string): HelperFn {
  const fn = helpers[name];
  if (!fn) throw new Error(`Unknown function: ${name}`);
  return fn;
}
