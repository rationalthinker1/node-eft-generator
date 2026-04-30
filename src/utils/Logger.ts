/**
 * Pure-presentation toolkit for record `log()` methods. ANSI colors,
 * padding, and currency/date formatting helpers — no record knowledge.
 *
 * The high-level helpers (`title`, `row`, `endSection`, `printf`) emit
 * directly to stdout/stderr; the low-level helpers (`paint`, `format`,
 * etc.) return strings for callers that need to compose further.
 *
 * `printf` / `row` accept a small HTML-like markup so call sites stay
 * readable instead of building ANSI strings by hand:
 *
 * ```ts
 * Logger.row('debits', `<b>${count.padStart(4)}</b>   <yellow>${money}</yellow>`);
 * ```
 *
 * Recognised tags: `<b>` / `<bold>`, `<dim>`, `<red>`, `<green>`,
 * `<yellow>`, `<cyan>`. Tags nest — closing one resets and re-emits the
 * remaining outer codes. Unknown tags are left as literal text.
 */
const LABEL_WIDTH = 12;

export class Logger {
  static readonly ANSI = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
  } as const;

  static readonly SECTION_RULE = '─'.repeat(110);

  // ── Low-level helpers ────────────────────────────────────────────────

  static paint(code: string, text: string): string {
    return `${code}${text}${Logger.ANSI.reset}`;
  }

  static isoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  static fmtCurrency(amount: number): string {
    return (
      '$' +
      amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  }

  /**
   * Substitute `<b>` / `<dim>` / `<red>` / etc. tags in `template` with
   * the matching ANSI escapes. Returns the formatted string; does NOT
   * print. Useful for `console.warn` and other non-stdout sinks.
   */
  static format(template: string): string {
    const stack: string[] = [];
    return template.replace(
      /<(\/?)([a-z]+)>/g,
      (literal: string, slash: string, tag: string): string => {
        if (slash === '/') {
          const index = stack.lastIndexOf(tag);
          if (index === -1) return literal;
          stack.splice(index, 1);
          return Logger.ANSI.reset + stack.map((t) => Logger.#ansiFor(t) ?? '').join('');
        }
        const code = Logger.#ansiFor(tag);
        if (code === null) return literal;
        stack.push(tag);
        return code;
      }
    );
  }

  // ── High-level helpers ───────────────────────────────────────────────

  /**
   * Opens a logged section: blank line, dim rule, then the bold-cyan
   * label indented two spaces. Pair with {@link endSection}.
   */
  static title(label: string): void {
    console.log('');
    console.log(Logger.paint(Logger.ANSI.dim, Logger.SECTION_RULE));
    Logger.printf(`  <b><cyan>${label}</cyan></b>`);
  }

  /**
   * Closes a logged section: dim rule, then a blank line. Pair with
   * {@link title}.
   */
  static endSection(): void {
    console.log(Logger.paint(Logger.ANSI.dim, Logger.SECTION_RULE));
    console.log('');
  }

  /**
   * Prints a labeled row: two-space indent, dim fixed-width
   * padded label, then the rendered template.
   */
  static row(label: string, valueTemplate: string): void {
    console.log(
      '  ' +
        Logger.paint(Logger.ANSI.dim, label.padEnd(LABEL_WIDTH)) +
        Logger.format(valueTemplate)
    );
  }

  /**
   * Format the template (substituting ANSI tags) and print to stdout.
   */
  static printf(template: string): void {
    console.log(Logger.format(template));
  }

  // ── Internal ─────────────────────────────────────────────────────────

  static #ansiFor(tag: string): string | null {
    switch (tag) {
      case 'b':
      case 'bold':
        return Logger.ANSI.bold;
      case 'dim':
        return Logger.ANSI.dim;
      case 'red':
        return Logger.ANSI.red;
      case 'green':
        return Logger.ANSI.green;
      case 'yellow':
        return Logger.ANSI.yellow;
      case 'cyan':
        return Logger.ANSI.cyan;
      default:
        return null;
    }
  }
}
