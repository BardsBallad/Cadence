export type TokenType =
  | 'NUMBER'
  | 'STRING'
  | 'IDENT'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACK'
  | 'RBRACK'
  | 'COMMA'
  | 'SEMICOLON'
  | 'QUESTION'
  | 'COLON'
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'SLASH'
  | 'CARET'
  | 'LT'
  | 'LTE'
  | 'GT'
  | 'GTE'
  | 'EQ'
  | 'NEQ'
  | 'AND'
  | 'OR'
  | 'EOF';

export interface Token {
  type: TokenType;
  lexeme: string;
  position: number; // index in source for error messages
}
