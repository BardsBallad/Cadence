import { Token, TokenType } from '../types/tokens';

const isDigit = (c: string) => c >= '0' && c <= '9';
const isAlpha = (c: string) => /[A-Za-z_]/.test(c);
const isAlnum = (c: string) => /[A-Za-z0-9_]/.test(c);

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const push = (type: TokenType, lexeme: string, position: number) => {
    tokens.push({ type, lexeme, position });
  };

  while (i < source.length) {
    const start = i;
    const ch = source[i];

    // whitespace and newlines
    if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
      i++;
      continue;
    }

    // numbers (integer and decimals)
    if (isDigit(ch) || (ch === '.' && isDigit(source[i + 1]))) {
      let num = '';
      let dotSeen = false;
      while (i < source.length) {
        const c = source[i];
        if (isDigit(c)) {
          num += c;
          i++;
        } else if (c === '.' && !dotSeen && isDigit(source[i + 1])) {
          dotSeen = true;
          num += c;
          i++;
        } else {
          break;
        }
      }
      push('NUMBER', num, start);
      continue;
    }

    // strings: only support simple single or double quotes
    if (ch === '"' || ch === '\'') {
      const quote = ch;
      i++; // skip opening quote
      let str = '';
      while (i < source.length && source[i] !== quote) {
        const c = source[i];
        if (c === '\\') {
          const next = source[i + 1];
          if (next === '"' || next === '\'' || next === '\\') {
            str += next;
            i += 2;
            continue;
          }
        }
        str += c;
        i++;
      }
      if (source[i] !== quote) {
        throw new Error(`Unterminated string at ${start}`);
      }
      i++; // closing quote
      tokens.push({ type: 'STRING', lexeme: str, position: start });
      continue;
    }

    // identifiers
    if (isAlpha(ch)) {
      let ident = '';
      while (i < source.length && isAlnum(source[i])) {
        ident += source[i++];
      }
      push('IDENT', ident, start);
      continue;
    }

    // multi-char operators
    const two = source.slice(i, i + 2);
    if (two === '<=' || two === '>=') {
      push(two === '<=' ? 'LTE' : 'GTE', two, start);
      i += 2;
      continue;
    }
    if (two === '==' || two === '!=') {
      push(two === '==' ? 'EQ' : 'NEQ', two, start);
      i += 2;
      continue;
    }
    if (two === '&&' || two === '||') {
      push(two === '&&' ? 'AND' : 'OR', two, start);
      i += 2;
      continue;
    }

    // single-char tokens
    switch (ch) {
      case '+': push('PLUS', ch, start); i++; continue;
      case '-': push('MINUS', ch, start); i++; continue;
      case '*': push('STAR', ch, start); i++; continue;
      case '/': push('SLASH', ch, start); i++; continue;
      case '^': push('CARET', ch, start); i++; continue;
      case '<': push('LT', ch, start); i++; continue;
      case '>': push('GT', ch, start); i++; continue;
      case '(': push('LPAREN', ch, start); i++; continue;
      case ')': push('RPAREN', ch, start); i++; continue;
      case '[': push('LBRACK', ch, start); i++; continue;
      case ']': push('RBRACK', ch, start); i++; continue;
      case ',': push('COMMA', ch, start); i++; continue;
      case ';': push('SEMICOLON', ch, start); i++; continue;
      case '?': push('QUESTION', ch, start); i++; continue;
      case ':': push('COLON', ch, start); i++; continue;
    }

    throw new Error(`Unexpected character '${ch}' at ${i}`);
  }

  push('EOF', '', i);
  return tokens;
}
