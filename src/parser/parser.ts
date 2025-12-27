import { tokenize } from '../lexer/tokenize';
import { Token } from '../types/tokens';
import { Program, Statement, Expression, Identifier, CallExpression } from './ast';

type Nud = () => Expression; // null denotation
type Led = (left: Expression) => Expression; // left denotation

type Parselet = {
  lbp?: number; // left binding power
  nud?: Nud;
  led?: Led;
};

export class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(source: string) {
    this.tokens = tokenize(source);
  }

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private advance(): Token {
    return this.tokens[this.pos++];
  }

  private expect(type: Token['type'], message: string) {
    const t = this.peek();
    if (t.type !== type) throw new Error(message + ` at ${t.position}`);
    return this.advance();
  }

  parseProgram(): Program {
    const body: Statement[] = [];
    while (this.peek().type !== 'EOF') {
      // allow stray semicolons
      if (this.peek().type === 'SEMICOLON') { this.advance(); continue; }
      const stmt = this.parseStatement();
      body.push(stmt);
      if (this.peek().type === 'SEMICOLON') this.advance();
    }
    return { type: 'Program', body };
  }

  private parseStatement(): Statement {
    const expr = this.parseExpression(0);
    let assignTo: string | undefined;
    if (this.peek().type === 'LBRACK') {
      this.advance();
      const ident = this.expect('IDENT', 'Expected identifier in brackets').lexeme;
      this.expect('RBRACK', 'Expected closing ] after identifier');
      assignTo = ident;
    }
    return { type: 'Statement', expression: expr, assignTo };
  }

  private parseExpression(rbp: number): Expression {
    let t = this.advance();
    let left = this.nudFor(t);
    while (rbp < this.lbpOf(this.peek())) {
      t = this.advance();
      left = this.ledFor(t, left);
    }
    return left;
  }

  private nudFor(token: Token): Expression {
    switch (token.type) {
      case 'NUMBER':
        return { type: 'NumberLiteral', value: Number(token.lexeme) };
      case 'STRING':
        return { type: 'StringLiteral', value: token.lexeme };
      case 'IDENT': {
        // function call or identifier
        if (this.peek().type === 'LPAREN') {
          const name = token.lexeme;
          this.advance(); // (
          const args: Expression[] = [];
          if (this.peek().type !== 'RPAREN') {
            // parse comma-separated args
            args.push(this.parseExpression(0));
            while (this.peek().type === 'COMMA') {
              this.advance();
              args.push(this.parseExpression(0));
            }
          }
          this.expect('RPAREN', 'Expected ) after arguments');
          const callee: Identifier = { type: 'Identifier', name: name };
          const call: CallExpression = { type: 'CallExpression', callee, args };
          return call;
        }
        if (token.lexeme === 'true' || token.lexeme === 'false') {
          return { type: 'BooleanLiteral', value: token.lexeme === 'true' };
        }
        return { type: 'Identifier', name: token.lexeme };
      }
      case 'LPAREN': {
        const expr = this.parseExpression(0);
        this.expect('RPAREN', 'Expected ) after expression');
        return { type: 'Grouping', expression: expr };
      }
      case 'MINUS':
      case 'PLUS': {
        const op = token.type === 'MINUS' ? '-' : '+';
        const argument = this.parseExpression(this.prefixBindingPower(op));
        return { type: 'UnaryExpression', operator: op, argument };
      }
      default:
        throw new Error(`Unexpected token ${token.type} at ${token.position}`);
    }
  }

  private ledFor(token: Token, left: Expression): Expression {
    switch (token.type) {
      case 'PLUS':
      case 'MINUS':
      case 'STAR':
      case 'SLASH':
      case 'CARET':
      case 'LT':
      case 'LTE':
      case 'GT':
      case 'GTE':
      case 'EQ':
      case 'NEQ':
      case 'AND':
      case 'OR': {
        const op = this.tokenToOperator(token.type);
        const rbp = this.infixRightBindingPower(op);
        const right = this.parseExpression(rbp);
        return { type: 'BinaryExpression', operator: op as any, left, right };
      }
      case 'QUESTION': {
        // parse ternary conditional: left ? x : y
        const consequent = this.parseExpression(0);
        this.expect('COLON', 'Expected : in conditional expression');
        const alternate = this.parseExpression(2); // bind weaker than most ops
        return { type: 'ConditionalExpression', test: left, consequent, alternate };
      }
      default:
        throw new Error(`Unexpected token in led: ${token.type} at ${token.position}`);
    }
  }

  private lbpOf(token: Token): number {
    switch (token.type) {
      case 'CARET': return 50; // right-associative handled via rbp
      case 'STAR':
      case 'SLASH': return 40;
      case 'PLUS':
      case 'MINUS': return 30;
      case 'LT':
      case 'LTE':
      case 'GT':
      case 'GTE': return 20;
      case 'EQ':
      case 'NEQ': return 15;
      case 'AND': return 10;
      case 'OR': return 9;
      case 'QUESTION': return 2; // ternary
      default: return 0;
    }
  }

  private prefixBindingPower(op: string) {
    return 60; // higher than any infix
  }

  private infixRightBindingPower(op: string) {
    switch (op) {
      case '^': return 49; // right-assoc: less than lbp 50
      default: return this.lbpOf({ type: this.operatorToTokenType(op), lexeme: '', position: 0 } as Token);
    }
  }

  private tokenToOperator(type: Token['type']): string {
    switch (type) {
      case 'PLUS': return '+';
      case 'MINUS': return '-';
      case 'STAR': return '*';
      case 'SLASH': return '/';
      case 'CARET': return '^';
      case 'LT': return '<';
      case 'LTE': return '<=';
      case 'GT': return '>';
      case 'GTE': return '>=';
      case 'EQ': return '==';
      case 'NEQ': return '!=';
      case 'AND': return '&&';
      case 'OR': return '||';
      default: throw new Error('Unknown operator token ' + type);
    }
  }

  private operatorToTokenType(op: string): Token['type'] {
    switch (op) {
      case '+': return 'PLUS';
      case '-': return 'MINUS';
      case '*': return 'STAR';
      case '/': return 'SLASH';
      case '^': return 'CARET';
      case '<': return 'LT';
      case '<=': return 'LTE';
      case '>': return 'GT';
      case '>=': return 'GTE';
      case '==': return 'EQ';
      case '!=': return 'NEQ';
      case '&&': return 'AND';
      case '||': return 'OR';
      default: throw new Error('Unknown operator ' + op);
    }
  }
}

export function parse(source: string): Program {
  return new Parser(source).parseProgram();
}
