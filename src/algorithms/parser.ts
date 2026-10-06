// AST Parser for Regular Expressions with Clear Diagnostic Errors

import type { ASTNode } from './types';
import { type Token, tokenize, insertExplicitConcat } from './tokenizer';

export class ParseError extends Error {
  position: number;
  suggestion?: string;

  constructor(message: string, position: number = 0, suggestion?: string) {
    super(message);
    this.name = 'ParseError';
    this.position = position;
    this.suggestion = suggestion;
  }
}

export class RegexParser {
  private tokens: Token[] = [];
  private current: number = 0;
  private rawInput: string = '';

  constructor(input: string) {
    this.rawInput = input;
  }

  public parse(): ASTNode {
    if (!this.rawInput.trim()) {
      throw new ParseError(
        'The regular expression cannot be empty.',
        0,
        'Enter a valid regular expression such as "a(b|c)*" or "ε" for the empty string.'
      );
    }

    const rawTokens = tokenize(this.rawInput);
    if (rawTokens.length === 0) {
      throw new ParseError(
        'Empty regular expression.',
        0,
        'Provide at least one symbol or "ε".'
      );
    }

    // Quick syntax checks before concat insertion
    this.validateRawTokens(rawTokens);

    this.tokens = insertExplicitConcat(rawTokens);
    this.current = 0;

    const ast = this.parseUnion();

    if (!this.isAtEnd()) {
      const extraToken = this.peek();
      if (extraToken.type === 'RPAREN') {
        throw new ParseError(
          `Unexpected closing parenthesis ')' with no matching opening '('.`,
          extraToken.pos,
          `Check your parentheses matching or remove extra ')'.`
        );
      }
      throw new ParseError(
        `Unexpected token '${extraToken.value}' at position ${extraToken.pos + 1}.`,
        extraToken.pos,
        `Verify the syntax around '${extraToken.value}'.`
      );
    }

    return ast;
  }

  private validateRawTokens(tokens: Token[]) {
    // Check first token
    const first = tokens[0];
    if (first.type === 'STAR' || first.type === 'PLUS' || first.type === 'QUESTION') {
      throw new ParseError(
        `Postfix operator '${first.value}' cannot appear at the start of an expression.`,
        first.pos,
        `Provide a preceding character or group before '${first.value}' (e.g. 'a${first.value}').`
      );
    }
    if (first.type === 'UNION') {
      throw new ParseError(
        `Alternation operator '|' requires an expression on its left.`,
        first.pos,
        `Add a left-hand pattern before '|' (e.g. 'a|b').`
      );
    }

    // Check last token
    const last = tokens[tokens.length - 1];
    if (last.type === 'UNION') {
      throw new ParseError(
        `Alternation operator '|' requires an expression on its right.`,
        last.pos,
        `Add a right-hand pattern after '|' or remove the trailing '|'.`
      );
    }

    // Check consecutive invalid tokens
    for (let i = 0; i < tokens.length - 1; i++) {
      const curr = tokens[i];
      const next = tokens[i + 1];

      // Repeated postfix operator: a** or a*+ or a?*
      if (
        (curr.type === 'STAR' || curr.type === 'PLUS' || curr.type === 'QUESTION') &&
        (next.type === 'STAR' || next.type === 'PLUS' || next.type === 'QUESTION')
      ) {
        throw new ParseError(
          `Consecutive quantifier operators '${curr.value}${next.value}' are invalid.`,
          next.pos,
          `Remove duplicate quantifier '${next.value}' or wrap the expression in parentheses, e.g. '(a${curr.value})${next.value}'.`
        );
      }

      // Empty union like ||
      if (curr.type === 'UNION' && next.type === 'UNION') {
        throw new ParseError(
          `Empty alternation '||' is not allowed.`,
          next.pos,
          `Remove redundant '|' or place a subexpression between them.`
        );
      }

      // Empty group ()
      if (curr.type === 'LPAREN' && next.type === 'RPAREN') {
        throw new ParseError(
          `Empty parentheses '()' are not allowed.`,
          curr.pos,
          `Use 'ε' if you intended to represent the empty string, or provide an expression inside '()'.`
        );
      }

      // Operator directly after LPAREN: (* or (+ or (? or (|
      if (
        curr.type === 'LPAREN' &&
        (next.type === 'STAR' || next.type === 'PLUS' || next.type === 'QUESTION' || next.type === 'UNION')
      ) {
        throw new ParseError(
          `Operator '${next.value}' cannot immediately follow an opening parenthesis '('.`,
          next.pos,
          `Add an expression before the '${next.value}'.`
        );
      }
    }

    // Validate parentheses balance
    let openCount = 0;
    for (const t of tokens) {
      if (t.type === 'LPAREN') openCount++;
      if (t.type === 'RPAREN') {
        openCount--;
        if (openCount < 0) {
          throw new ParseError(
            `Unmatched closing parenthesis ')' with no preceding '('.`,
            t.pos,
            `Remove the extra ')' or add a matching '(' before it.`
          );
        }
      }
    }
    if (openCount > 0) {
      throw new ParseError(
        `Unmatched opening parenthesis '('. Missing ${openCount} closing ')' parenthesis.`,
        this.rawInput.length - 1,
        `Close all opened parentheses before submitting.`
      );
    }
  }

  // Grammar: UnionExpr -> ConcatExpr ( '|' ConcatExpr )*
  private parseUnion(): ASTNode {
    let node = this.parseConcat();

    while (this.match('UNION')) {
      const right = this.parseConcat();
      node = {
        type: 'union',
        left: node,
        right,
      };
    }

    return node;
  }

  // Grammar: ConcatExpr -> PostfixExpr ( '·' PostfixExpr )*
  private parseConcat(): ASTNode {
    let node = this.parsePostfix();

    while (this.match('CONCAT')) {
      const right = this.parsePostfix();
      node = {
        type: 'concat',
        left: node,
        right,
      };
    }

    return node;
  }

  // Grammar: PostfixExpr -> PrimaryExpr ( '*' | '+' | '?' )*
  private parsePostfix(): ASTNode {
    let node = this.parsePrimary();

    while (true) {
      if (this.match('STAR')) {
        node = { type: 'star', expr: node };
      } else if (this.match('PLUS')) {
        node = { type: 'plus', expr: node };
      } else if (this.match('QUESTION')) {
        node = { type: 'question', expr: node };
      } else {
        break;
      }
    }

    return node;
  }

  // Grammar: PrimaryExpr -> CHAR | EPSILON | '(' UnionExpr ')'
  private parsePrimary(): ASTNode {
    if (this.match('CHAR')) {
      const prev = this.previous();
      return { type: 'literal', char: prev.value };
    }

    if (this.match('EPSILON')) {
      return { type: 'epsilon' };
    }

    if (this.match('LPAREN')) {
      const node = this.parseUnion();
      if (!this.match('RPAREN')) {
        const token = this.peek();
        throw new ParseError(
          `Expected closing parenthesis ')' to close group.`,
          token ? token.pos : this.rawInput.length,
          `Add ')' where appropriate.`
        );
      }
      return node;
    }

    const currentToken = this.peek();
    throw new ParseError(
      `Expected a symbol, '(' or 'ε' but found '${currentToken ? currentToken.value : 'end of input'}'.`,
      currentToken ? currentToken.pos : this.rawInput.length,
      `Check the regular expression syntax at this position.`
    );
  }

  private match(...types: string[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: string): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}

export function parseRegex(input: string): ASTNode {
  const parser = new RegexParser(input);
  return parser.parse();
}
