import {
  TRANSACTION_TYPE,
  type EFTConfiguration,
  type EFTTransactionSegment,
  type TransactionType
} from '#types';
import { containsProhibitedCharacters } from '#utils';

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

export interface HeaderLogContext {
  eftConfig: EFTConfiguration;
  fileCreationDate: Date;
  fileCreationJulianDate: string;
}

export interface SegmentLogContext {
  recordType: TransactionType;
  recordNumber: number;
  segmentIndex: number;
  segment: EFTTransactionSegment;
  resolvedCrossReferenceNumber: string;
  paymentDate: Date;
  paymentJulianDate: string;
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
 * Renders header / segment / trailer information in a colored, tabular
 * layout intended for terminal output during file generation. The
 * generator composes one of these and calls the three log methods at
 * the right pipeline points; subclasses can override individual methods
 * (e.g., to silence output, write to a file, or emit JSON).
 */
export class EFTFileLogger {
  logHeader(ctx: HeaderLogContext): void {
    const { eftConfig, fileCreationDate, fileCreationJulianDate } = ctx;
    const dayOfYear = fileCreationJulianDate.slice(3);

    console.log('');
    console.log(paint(ANSI.dim, SECTION_RULE));
    console.log('  ' + paint(ANSI.bold + ANSI.cyan, 'HEADER'));
    console.log(row('originator', paint(ANSI.bold, eftConfig.originatorId)));
    console.log(row('fcn', paint(ANSI.bold, eftConfig.fileCreationNumber)));
    console.log(
      row(
        'created',
        isoDate(fileCreationDate) +
          paint(
            ANSI.dim,
            `  ·  day ${dayOfYear}  ·  julian ${fileCreationJulianDate}`
          )
      )
    );
    console.log(row('centre', eftConfig.destinationDataCentre));
    console.log(row('currency', eftConfig.destinationCurrency ?? '(default)'));
    console.log(paint(ANSI.dim, SECTION_RULE));
    console.log('');
  }

  logSegment(ctx: SegmentLogContext): void {
    const {
      recordType,
      recordNumber,
      segmentIndex,
      segment,
      resolvedCrossReferenceNumber,
      paymentDate,
      paymentJulianDate
    } = ctx;

    // Inline warning so it appears with its transaction, not at the top.
    if (containsProhibitedCharacters(segment.payeeName)) {
      console.warn(
        paint(
          ANSI.yellow,
          `  ⚠  payeeName contains prohibited characters and will be sanitized: ${segment.payeeName}`
        )
      );
    }

    const tagColor =
      recordType === TRANSACTION_TYPE.CREDIT ? ANSI.green : ANSI.red;
    const dayOfYear = paymentJulianDate.slice(3);
    const bank = `${segment.bankInstitutionNumber}-${segment.bankTransitNumber}-${segment.bankAccountNumber}`;

    const idx = `${recordType} ${recordNumber.toString().padStart(3, '0')}.${(segmentIndex + 1).toString()}`;
    const xref = resolvedCrossReferenceNumber.padEnd(22);
    const payee = segment.payeeName.padEnd(32);
    const amount = fmtCurrency(segment.amount).padStart(12);
    const dateStr = `${isoDate(paymentDate)} (${dayOfYear})`.padEnd(18);
    const bankStr = bank.padEnd(22);
    const cpa = `cpa ${segment.cpaCode}`;

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
  }

  logTrailer(ctx: TrailerLogContext): void {
    const { totalRecordCount, debitCount, debitValue, creditCount, creditValue } =
      ctx;

    console.log('');
    console.log(paint(ANSI.dim, SECTION_RULE));
    console.log('  ' + paint(ANSI.bold + ANSI.cyan, 'TRAILER'));
    console.log(row('records', paint(ANSI.bold, totalRecordCount.toString())));
    console.log(
      row(
        'debits',
        paint(ANSI.bold, debitCount.toString().padStart(4)) +
          '   ' +
          paint(ANSI.yellow, fmtCurrency(debitValue))
      )
    );
    console.log(
      row(
        'credits',
        paint(ANSI.bold, creditCount.toString().padStart(4)) +
          '   ' +
          paint(ANSI.yellow, fmtCurrency(creditValue))
      )
    );
    console.log(paint(ANSI.dim, SECTION_RULE));
    console.log('');
  }
}
