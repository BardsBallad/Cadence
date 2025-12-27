import { parse } from '../parser/parser';
import { createFrozenContext } from './context';
import { evaluate } from './evaluator';

export function runCadence(program: string, input: Record<string, any>): any {
  const ast = parse(program);
  const frozen = createFrozenContext(input);
  return evaluate(ast, { input: frozen });
}
