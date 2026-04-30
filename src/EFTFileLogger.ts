import { TRANSACTION_TYPE, type TransactionType } from '#types';

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
} as const;

const SECTION_RULE = '─'.repeat(110);

function paint(code: string, text: string): string {
  return `${code}${text}${ANSI.reset}`;
}

function row(labelText: string, value: string): string {
  return '  ' + paint(ANSI.dim, labelText.padEnd(12)) + value;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function fmtCurrency(amount: number): string {
  return (
    '$' +
    amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  );
}

/**
 * All fields are display values — exactly as they will appear in the
 * generated file (text fields already sanitized, currency already in the
 * caller's preferred display string, etc.). The logger does not
 * transform them; it only paints and aligns.
 */
export interface HeaderLogContext {
  originatorId: string;
  fileCreationNumber: string;
  fileCreationDate: Date;
  fileCreationJulianDate: string;
  destinationDataCentre: string;
  destinationCurrency: string;
}

export interface SegmentLogContext {
  recordType: TransactionType;
  recordNumber: number;
  segmentIndex: number;
  crossReferenceNumber: string;
  payeeName: string;
  amount: number;
  bankInstitutionNumber: string;
  bankTransitNumber: string;
  bankAccountNumber: string;
  cpaCode: string;
  paymentDate: Date;
  paymentJulianDate: string;
  /**
   * Optional inline warning, rendered immediately above the row so it
   * stays attached to its transaction. Caller is responsible for
   * deciding when to populate it.
   */
  warning?: string;
}

export interface TrailerLogContext {
  totalRecordCount: number;
  debitCount: number;
  debitValue: number;
  creditCount: number;
  creditValue: number;
}

/**
 * Console logger for `EFTFileGenerator`.
 *
 * Pure presentation layer — receives display-ready field values and
 * renders them in a colored, tabular layout for terminal output during
 * file generation. The generator owns all domain logic (sanitization,
 * warning detection, value derivation); the logger just paints.
 *
 * Subclass and override individual methods to redirect output, suppress
 * logging, emit JSON, etc.
 */
export class EFTFileLogger {
  logHeader(ctx: HeaderLogContext): void {
    const dayOfYear = ctx.fileCreationJulianDate.slice(3);

    console.log('');
    console.log(paint(ANSI.dim, SECTION_RULE));
    console.log('  ' + paint(ANSI.bold + ANSI.cyan, 'HEADER'));
    console.log(row('originator', paint(ANSI.bold, ctx.originatorId)));
    console.log(row('fcn', paint(ANSI.bold, ctx.fileCreationNumber)));
    console.log(
      row(
        'created',
        isoDate(ctx.fileCreationDate) +
          paint(
            ANSI.dim,
            `  ·  day ${dayOfYear}  ·  julian ${ctx.fileCreationJulianDate}`
          )
      )
    );
    console.log(row('centre', ctx.destinationDataCentre));
    console.log(row('currency', ctx.destinationCurrency));
    console.log(paint(ANSI.dim, SECTION_RULE));
    console.log('');
  }

  logSegment(ctx: SegmentLogContext): void {
    const tagColor =
      ctx.recordType === TRANSACTION_TYPE.CREDIT ? ANSI.green : ANSI.red;
    const dayOfYear = ctx.paymentJulianDate.slice(3);
    const bank = `${ctx.bankInstitutionNumber}-${ctx.bankTransitNumber}-${ctx.bankAccountNumber}`;

    const idx = `${ctx.recordType} ${ctx.recordNumber.toString().padStart(3, '0')}.${(ctx.segmentIndex + 1).toString()}`;
    const xref = ctx.crossReferenceNumber.padEnd(22);
    const payee = ctx.payeeName.padEnd(32);
    const amount = fmtCurrency(ctx.amount).padStart(12);
    const dateStr = `${isoDate(ctx.paymentDate)} (${dayOfYear})`.padEnd(18);
    const bankStr = bank.padEnd(22);
    const cpa = `cpa ${ctx.cpaCode}`;

    console.log(
      '  ' +
        paint(ANSI.bold + tagColor, idx.padEnd(11)) +
        paint(ANSI.cyan, xref) +
        paint(ANSI.bold, payee) +
        paint(ANSI.yellow, amount) +
        '   ' +
        paint(ANSI.dim, dateStr) +
        paint(ANSI.dim, bankStr) +
        paint(ANSI.dim, cpa)
    );

    if (ctx.warning !== undefined) {
      console.warn(paint(ANSI.yellow, `  ⚠  ${ctx.warning}`));
    }
  }

  logTrailer(ctx: TrailerLogContext): void {
    console.log('');
    console.log(paint(ANSI.dim, SECTION_RULE));
    console.log('  ' + paint(ANSI.bold + ANSI.cyan, 'TRAILER'));
    console.log(row('records', paint(ANSI.bold, ctx.totalRecordCount.toString())));
    console.log(
      row(
        'debits',
        paint(ANSI.bold, ctx.debitCount.toString().padStart(4)) +
          '   ' +
          paint(ANSI.yellow, fmtCurrency(ctx.debitValue))
      )
    );
    console.log(
      row(
        'credits',
        paint(ANSI.bold, ctx.creditCount.toString().padStart(4)) +
          '   ' +
          paint(ANSI.yellow, fmtCurrency(ctx.creditValue))
      )
    );
    console.log(paint(ANSI.dim, SECTION_RULE));
    console.log('');
  }
}
