/**
 * CPA-005 spec constants — record sizes, field widths, count limits, and
 * date offsets. Lives in its own module so the record classes (Header,
 * Transaction, Segment, Trailer) and the validator can both depend on it
 * without forming a value-import cycle.
 */

export const RECORD_LENGTH = 1464;
export const MAX_SEGMENTS_PER_RECORD = 6;
export const MAX_TRANSACTION_AMOUNT = 100_000_000;
export const MAX_FILE_TRANSACTION_COUNT = 999_999_999;

export const FIELD_WIDTHS = {
  originatorId: 10,
  originatorShortName: 15,
  originatorLongName: 30,
  payeeName: 30,
  crossReference: 19
} as const;

const MS_PER_DAY = 86_400_000;
export const MAX_PAYMENT_DATE_OFFSET_DAYS = 173;
export const MAX_PAYMENT_DATE_OFFSET_MS = MAX_PAYMENT_DATE_OFFSET_DAYS * MS_PER_DAY;
