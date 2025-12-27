import { Program, Statement, Expression } from '../parser/ast';
import { getHelper } from './functions';
import { Scope } from './context';

export interface EvalOptions {
  input: Readonly<Record<string, any>>;
}

export function evaluate(program: Program, options: EvalOptions): any {
  const scope: Scope = Object.create(null);
  let last: any;
  for (const stmt of program.body) {
    last = evalExpression(stmt.expression, scope, options.input);
    if (stmt.assignTo) {
      scope[stmt.assignTo] = last;
    }
  }
  return last;
}

function evalExpression(expr: Expression, scope: Scope, input: Readonly<Record<string, any>>): any {
  switch (expr.type) {
    case 'NumberLiteral': return expr.value;
    case 'StringLiteral': return expr.value;
    case 'BooleanLiteral': return expr.value;
    case 'Identifier': {
      if (Object.prototype.hasOwnProperty.call(scope, expr.name)) return scope[expr.name];
      if (Object.prototype.hasOwnProperty.call(input, expr.name)) return (input as any)[expr.name];
      throw new Error(`Unknown identifier: ${expr.name}`);
    }
    case 'Grouping':
      return evalExpression(expr.expression, scope, input);
    case 'UnaryExpression': {
      const v = evalExpression(expr.argument, scope, input);
      switch (expr.operator) {
        case '+': return toNumber(v);
        case '-': return -toNumber(v);
      }
      throw new Error('Unknown unary operator');
    }
    case 'BinaryExpression': {
      if (expr.operator === '&&') {
        const l = evalExpression(expr.left, scope, input);
        return l ? evalExpression(expr.right, scope, input) : l;
      }
      if (expr.operator === '||') {
        const l = evalExpression(expr.left, scope, input);
        return l ? l : evalExpression(expr.right, scope, input);
      }
      const left = evalExpression(expr.left, scope, input);
      const right = evalExpression(expr.right, scope, input);
      switch (expr.operator) {
        case '+':
          if (typeof left === 'string' || typeof right === 'string') return String(left) + String(right);
          return toNumber(left) + toNumber(right);
        case '-': return toNumber(left) - toNumber(right);
        case '*': return toNumber(left) * toNumber(right);
        case '/': return toNumber(left) / toNumber(right);
        case '^': return Math.pow(toNumber(left), toNumber(right));
        case '<': return toNumber(left) < toNumber(right);
        case '<=': return toNumber(left) <= toNumber(right);
        case '>': return toNumber(left) > toNumber(right);
        case '>=': return toNumber(left) >= toNumber(right);
        case '==': return left === right;
        case '!=': return left !== right;
      }
      throw new Error('Unknown binary operator');
    }
    case 'ConditionalExpression': {
      const cond = evalExpression(expr.test, scope, input);
      return cond ? evalExpression(expr.consequent, scope, input) : evalExpression(expr.alternate, scope, input);
    }
    case 'CallExpression': {
      const fn = getHelper(expr.callee.name);
      if (expr.args.length !== 1) throw new Error(`Function ${expr.callee.name} expects 1 argument`);
      const argVal = evalExpression(expr.args[0], scope, input);
      return fn(argVal);
    }
  }
}

function toNumber(v: any): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v))) return Number(v);
  throw new Error('Expected number');
}
