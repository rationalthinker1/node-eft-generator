/**
 * Constants and assertions derived from the CPA-005 standard.
 *
 * References:
 * - Canadian Payments Association Standard 005
 * - docs/rbc-cpa-005-reference.pdf
 * - docs/bmo-cpa-005-reference.pdf
 */

export const RECORD_LENGTH = 1464 as const;
export const MAX_SEGMENTS_PER_RECORD = 6 as const;
export const MAX_TRANSACTION_AMOUNT = 100_000_000 as const;
export const MAX_FILE_TRANSACTION_COUNT = 999_999_999 as const;

export const FIELD_WIDTHS = {
  recordType: 1,
  logicalRecordCount: 9,
  originatorId: 10,
  fileCreationNumber: 4,
  creationDate: 6,
  dataCentre: 5,
  reservedHeader: 20,
  currency: 3,
  headerFiller: 1406,

  cpaCode: 3,
  amount: 10,
  paymentDate: 6,
  institutionalIdLead: 1,
  institutionNumber: 3,
  transitNumber: 5,
  accountNumber: 12,
  segmentFillerZeros: 25,
  originatorShortName: 15,
  payeeName: 30,
  originatorLongName: 30,
  segmentFillerBlanks: 10,
  crossReference: 19,

  totalValueDebits: 14,
  totalNumberDebits: 8,
  totalValueCredits: 14,
  totalNumberCredits: 8,
  trailerFiller: 1396
} as const;

export const ALLOWED_CHAR_PATTERN = /^[0-9A-Z =_$.&*,\r]*$/;

interface FixedFieldOpts {
  align: 'left' | 'right';
  pad: ' ' | '0';
}

/**
 * Pad a value to a fixed width. Throws if the value already exceeds the width
 * so calculation bugs surface at the offending field instead of silently
 * truncating or producing an oversized record.
 */
export function fixedField(value: string, width: number, opts: FixedFieldOpts): string {
  if (value.length > width) {
    throw new Error(
      `CPA-005 field overflow: value of length ${String(value.length)} exceeds width ${String(width)} (value: "${value}")`
    );
  }
  return opts.align === 'left'
    ? value.padEnd(width, opts.pad)
    : value.padStart(width, opts.pad);
}

/**
 * Assert a fully-assembled logical record is exactly RECORD_LENGTH bytes.
 * Returns the record unchanged for chaining.
 */
export function assertRecordLength(record: string, kind: string): string {
  if (record.length !== RECORD_LENGTH) {
    throw new Error(
      `CPA-005 ${kind} record length is ${String(record.length)}, expected ${String(RECORD_LENGTH)}`
    );
  }
  return record;
}
