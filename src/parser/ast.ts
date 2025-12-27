export type NumberLiteral = { type: 'NumberLiteral'; value: number };
export type StringLiteral = { type: 'StringLiteral'; value: string };
export type Identifier = { type: 'Identifier'; name: string };
export type BooleanLiteral = { type: 'BooleanLiteral'; value: boolean };

export type UnaryExpression = {
  type: 'UnaryExpression';
  operator: '-' | '+';
  argument: Expression;
};

export type BinaryExpression = {
  type: 'BinaryExpression';
  operator:
    | '+'
    | '-'
    | '*'
    | '/'
    | '^'
    | '<'
    | '<='
    | '>'
    | '>='
    | '=='
    | '!='
    | '&&'
    | '||';
  left: Expression;
  right: Expression;
};

export type ConditionalExpression = {
  type: 'ConditionalExpression';
  test: Expression;
  consequent: Expression;
  alternate: Expression;
};

export type CallExpression = {
  type: 'CallExpression';
  callee: Identifier;
  args: Expression[];
};

export type Grouping = { type: 'Grouping'; expression: Expression };

export type Expression =
  | NumberLiteral
  | StringLiteral
  | BooleanLiteral
  | Identifier
  | UnaryExpression
  | BinaryExpression
  | ConditionalExpression
  | CallExpression
  | Grouping;

export type Statement = {
  type: 'Statement';
  expression: Expression;
  assignTo?: string; // optional variable name to store result
};

export type Program = {
  type: 'Program';
  body: Statement[];
};
