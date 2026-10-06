// Tokenizer for Regular Expression Parser

export type TokenType =
  | 'CHAR'
  | 'UNION'      // |
  | 'CONCAT'     // explicit concatenation operator .
  | 'STAR'       // *
  | 'PLUS'       // +
  | 'QUESTION'   // ?
  | 'LPAREN'     // (
  | 'RPAREN'     // )
  | 'EPSILON';   // ε, \e

export interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

export class TokenizerError extends Error {
  position: number;
  suggestion?: string;

  constructor(message: string, position: number, suggestion?: string) {
    super(message);
    this.name = 'TokenizerError';
    this.position = position;
    this.suggestion = suggestion;
  }
}

/**
 * Tokenizes a raw regular expression string into an array of raw tokens.
 */
export function tokenize(rawInput: string): Token[] {
  const input = rawInput.trim();
  if (!input) {
    return [];
  }

  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    // Whitespace handling: ignore regular whitespace unless escaped
    if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
      i++;
      continue;
    }

    // Escaped character \x
    if (char === '\\') {
      if (i + 1 >= input.length) {
        throw new TokenizerError(
          `Incomplete escape sequence at the end of expression.`,
          i,
          `Remove trailing '\\' or escape a specific character like '\\*' or '\\e'.`
        );
      }
      const nextChar = input[i + 1];
      if (nextChar === 'e' || nextChar === 'E' || nextChar === '0') {
        tokens.push({ type: 'EPSILON', value: 'ε', pos: i });
      } else {
        tokens.push({ type: 'CHAR', value: nextChar, pos: i });
      }
      i += 2;
      continue;
    }

    // Epsilon symbol
    if (char === 'ε' || char === 'ϵ') {
      tokens.push({ type: 'EPSILON', value: 'ε', pos: i });
      i++;
      continue;
    }

    // Word "epsilon"
    if (input.slice(i, i + 7).toLowerCase() === 'epsilon') {
      tokens.push({ type: 'EPSILON', value: 'ε', pos: i });
      i += 7;
      continue;
    }

    // Operators
    switch (char) {
      case '|':
        tokens.push({ type: 'UNION', value: '|', pos: i });
        i++;
        break;
      case '*':
        tokens.push({ type: 'STAR', value: '*', pos: i });
        i++;
        break;
      case '+':
        tokens.push({ type: 'PLUS', value: '+', pos: i });
        i++;
        break;
      case '?':
        tokens.push({ type: 'QUESTION', value: '?', pos: i });
        i++;
        break;
      case '(':
        tokens.push({ type: 'LPAREN', value: '(', pos: i });
        i++;
        break;
      case ')':
        tokens.push({ type: 'RPAREN', value: ')', pos: i });
        i++;
        break;
      default:
        // Any regular character
        tokens.push({ type: 'CHAR', value: char, pos: i });
        i++;
        break;
    }
  }

  return tokens;
}

/**
 * Inserts explicit concatenation tokens between adjacent tokens where concatenation is implied.
 *
 * Concatenation is inserted between:
 * 1. CHAR/EPSILON/RPAREN/STAR/PLUS/QUESTION and CHAR/EPSILON/LPAREN
 */
export function insertExplicitConcat(tokens: Token[]): Token[] {
  if (tokens.length <= 1) return tokens;

  const result: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];
    result.push(current);

    if (i + 1 < tokens.length) {
      const next = tokens[i + 1];

      const currentCanEndAnOperand =
        current.type === 'CHAR' ||
        current.type === 'EPSILON' ||
        current.type === 'RPAREN' ||
        current.type === 'STAR' ||
        current.type === 'PLUS' ||
        current.type === 'QUESTION';

      const nextCanStartAnOperand =
        next.type === 'CHAR' ||
        next.type === 'EPSILON' ||
        next.type === 'LPAREN';

      if (currentCanEndAnOperand && nextCanStartAnOperand) {
        result.push({
          type: 'CONCAT',
          value: '·',
          pos: current.pos,
        });
      }
    }
  }

  return result;
}
