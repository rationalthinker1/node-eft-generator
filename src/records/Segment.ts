import type {
  BankAccount,
  BankInstitution,
  BankTransit
} from '#domain/BankPADInformation';
import type { CPATransactionCode } from '#domain/CPACodes';
import type { EFTFileBuilder } from '#EFTFileBuilder';
import { Field, formatField, renderFields } from '#records/Field';
import { Logger } from '#utils/Logger';
import {
  TRANSACTION_TYPE,
  type EFTTransactionSegment,
  type Loggable,
  type Printable,
  type Validable,
  type TransactionType
} from '#domain/types';
import {
  assertRecordLength,
  containsProhibitedCharacters,
  MILLISECONDS_PER_DAY,
  sanitizeCPA005Text,
  toPaddedJulianDate
} from '#utils/index';

const SEGMENT_LENGTH = 240;

export const MAX_TRANSACTION_AMOUNT = 100_000_000;
export const MAX_PAYMENT_DATE_OFFSET_DAYS = 173;
const MAX_PAYMENT_DATE_OFFSET_MS = MAX_PAYMENT_DATE_OFFSET_DAYS * MILLISECONDS_PER_DAY;

export const SEGMENT_FIELD_WIDTHS = {
  payeeName: 30,
  crossReference: 19,
  returnInstitutionNumber: 3,
  returnTransitNumber: 5,
  returnAccountNumber: 12
} as const;

const blank = (n: number): string => ' '.repeat(n);
const zero = (n: number): string => '0'.repeat(n);

function defaultCrossRef(
  fileCreationNumber: string,
  recordNumber: number,
  segmentIndex: number
): string {
  return (
    'F' +
    fileCreationNumber +
    'R' +
    recordNumber.toString() +
    'S' +
    (segmentIndex + 1).toString()
  );
}

/**
 * One CPA-005 transaction segment (240 chars). A transaction record
 * holds 1 to 6 segments laid out end to end after a 24-char prefix.
 *
 * @Field positions are within the segment's own 1..240 coordinate
 * space — the parent Transaction handles concatenation.
 */
export class Segment implements Printable, Loggable, Validable {
  readonly #builder: EFTFileBuilder;

  // Context-only properties (not @Field-decorated); used by transforms
  // and log() but never rendered as their own field.
  recordType!: TransactionType;
  recordNumber!: number;
  segmentIndex!: number;
  fileCreationNumber!: string;

  @Field({ start: 1, end: 3, pad: '0', align: 'right' })
  cpaCode!: CPATransactionCode;

  @Field({
    start: 4,
    end: 13,
    pad: '0',
    align: 'right',
    transform: (v) => Math.round((v as number) * 100).toString()
  })
  amount!: number;

  @Field({
    start: 14,
    end: 19,
    pad: '0',
    align: 'right',
    transform: (v) => toPaddedJulianDate(v as Date)
  })
  paymentDate!: Date;

  @Field({ start: 20, end: 20, pad: '0', align: 'right' })
  institutionalIdLead = '';

  @Field({ start: 21, end: 23, pad: '0', align: 'right' })
  bankInstitutionNumber!: BankInstitution;

  @Field({ start: 24, end: 28, pad: '0', align: 'right' })
  bankTransitNumber!: BankTransit;

  @Field({ start: 29, end: 40, pad: ' ', align: 'left' })
  bankAccountNumber!: BankAccount;

  @Field({ start: 41, end: 65, pad: '0', align: 'right' })
  segmentFillerZeros = '';

  @Field({
    start: 66,
    end: 80,
    pad: ' ',
    align: 'left',
    transform: (v) => sanitizeCPA005Text(v as string)
  })
  originatorShortName!: string;

  @Field({
    start: 81,
    end: 110,
    pad: ' ',
    align: 'left',
    transform: (v) => sanitizeCPA005Text(v as string)
  })
  payeeName!: string;

  @Field({
    start: 111,
    end: 140,
    pad: ' ',
    align: 'left',
    transform: (v) => sanitizeCPA005Text(v as string)
  })
  originatorLongName!: string;

  @Field({ start: 141, end: 150, pad: ' ', align: 'left' })
  segmentFillerBlanks = '';

  @Field({
    start: 151,
    end: 169,
    pad: ' ',
    align: 'left',
    transform: (raw, instance) => {
      const seg = instance as Segment;
      const value =
        (raw as string | undefined) ??
        defaultCrossRef(seg.fileCreationNumber, seg.recordNumber, seg.segmentIndex);
      return sanitizeCPA005Text(value);
    }
  })
  crossReferenceNumber: string | undefined;

  @Field({ start: 170, end: 170, pad: '0', align: 'right' })
  returnInstitutionalIdLead = '';

  // Return routing fields render as blanks when omitted. The transform
  // returns the already-formatted blank value so normal field padding
  // preserves the CPA-005 layout.
  @Field({
    start: 171,
    end: 173,
    pad: '0',
    align: 'right',
    transform: (v) => (v as string | undefined) ?? blank(3)
  })
  returnInstitutionNumber: BankInstitution | undefined;

  @Field({
    start: 174,
    end: 178,
    pad: '0',
    align: 'right',
    transform: (v) => (v as string | undefined) ?? blank(5)
  })
  returnTransitNumber: BankTransit | undefined;

  @Field({
    start: 179,
    end: 190,
    pad: ' ',
    align: 'left',
    transform: (v) => (v as string | undefined) ?? ''
  })
  returnAccountNumber: BankAccount | undefined;

  @Field({
    start: 191,
    end: 240,
    pad: ' ',
    align: 'left',
    transform: (_raw, instance) => {
      const seg = instance as Segment;
      return seg.recordType === TRANSACTION_TYPE.DEBIT
        ? zero(33) + blank(6) + zero(11)
        : blank(39) + zero(11);
    }
  })
  trailingFiller = '';

  constructor(
    builder: EFTFileBuilder,
    seg: EFTTransactionSegment,
    recordType: TransactionType,
    recordNumber: number,
    segmentIndex: number
  ) {
    this.#builder = builder;
    const cfg = builder.getConfiguration();

    this.cpaCode = seg.cpaCode;
    this.amount = seg.amount;
    this.paymentDate = seg.paymentDate;
    this.bankInstitutionNumber = seg.bankInstitutionNumber;
    this.bankTransitNumber = seg.bankTransitNumber;
    this.bankAccountNumber = seg.bankAccountNumber;
    this.payeeName = seg.payeeName;
    this.crossReferenceNumber = seg.crossReferenceNumber;

    this.recordType = recordType;
    this.recordNumber = recordNumber;
    this.segmentIndex = segmentIndex;
    this.fileCreationNumber = cfg.fileCreationNumber;
    this.originatorShortName = cfg.originatorShortName;
    this.originatorLongName = cfg.originatorLongName;
    this.returnInstitutionNumber = cfg.returnInstitutionNumber;
    this.returnTransitNumber = cfg.returnTransitNumber;
    this.returnAccountNumber = cfg.returnAccountNumber;
  }

  print(): string {
    return assertRecordLength(renderFields(this, Segment), 'segment', SEGMENT_LENGTH);
  }

  log(): void {
    const tagColor = this.recordType === TRANSACTION_TYPE.CREDIT ? 'green' : 'red';
    const paymentJulianDate = formatField(this, Segment, 'paymentDate');
    const dayOfYear = paymentJulianDate.slice(3);
    const xref = formatField(this, Segment, 'crossReferenceNumber');
    const payee = formatField(this, Segment, 'payeeName');
    const bank = `${this.bankInstitutionNumber}-${this.bankTransitNumber}-${this.bankAccountNumber}`;

    const idx = `${this.recordType} ${this.recordNumber.toString().padStart(3, '0')}.${(this.segmentIndex + 1).toString()}`;
    const xrefStr = xref.padEnd(22);
    const payeeStr = payee.padEnd(32);
    const amountStr = Logger.fmtCurrency(this.amount).padStart(12);
    const dateStr = `${Logger.isoDate(this.paymentDate)} (${dayOfYear})`.padEnd(18);
    const bankStr = bank.padEnd(22);
    const cpa = `cpa ${this.cpaCode}`;

    Logger.printf(
      `  <b><${tagColor}>${idx.padEnd(11)}</${tagColor}></b>` +
        `<cyan>${xrefStr}</cyan>` +
        `<b>${payeeStr}</b>` +
        `<yellow>${amountStr}</yellow>` +
        `   <dim>${dateStr}</dim>` +
        `<dim>${bankStr}</dim>` +
        `<dim>${cpa}</dim>`
    );
  }

  /**
   * Validates segment-level invariants. Cross-segment uniqueness of
   * crossReferenceNumber is checked at the file level by EFTFileValidator
   * (it spans all segments across all transactions).
   *
   * Text fields are validated before generation so fixed-width rendering
   * never needs to repair prohibited CPA-005 characters.
   */
  validate(): void {
    const cfg = this.#builder.getConfiguration();
    const fileCreationDate = cfg.fileCreationDate ?? new Date();

    if (this.amount <= 0) {
      throw new Error(
        `Segment ${String(this.segmentIndex)} amount must be positive: ${String(this.amount)}`
      );
    }
    if (this.amount >= MAX_TRANSACTION_AMOUNT) {
      throw new Error(
        `Segment ${String(this.segmentIndex)} amount exceeds ${String(MAX_TRANSACTION_AMOUNT)}: ${String(this.amount)}`
      );
    }

    if (this.payeeName.length > SEGMENT_FIELD_WIDTHS.payeeName) {
      throw new Error(
        `payeeName exceeds ${String(SEGMENT_FIELD_WIDTHS.payeeName)} characters: ${this.payeeName}`
      );
    }
    if (containsProhibitedCharacters(this.payeeName)) {
      throw new Error(`payeeName contains prohibited characters: ${this.payeeName}`);
    }

    if (this.crossReferenceNumber !== undefined) {
      if (this.crossReferenceNumber.length > SEGMENT_FIELD_WIDTHS.crossReference) {
        throw new Error(
          `crossReferenceNumber exceeds ${String(SEGMENT_FIELD_WIDTHS.crossReference)} characters: ${this.crossReferenceNumber}`
        );
      }
      if (containsProhibitedCharacters(this.crossReferenceNumber)) {
        throw new Error(
          `crossReferenceNumber contains prohibited characters: ${this.crossReferenceNumber}`
        );
      }
    }

    const offsetMs = this.paymentDate.getTime() - fileCreationDate.getTime();
    // Current compatibility rule is symmetric: payments are accepted up to
    // 173 days before or after the file creation date.
    if (Math.abs(offsetMs) > MAX_PAYMENT_DATE_OFFSET_MS) {
      throw new Error(
        `Segment ${String(this.segmentIndex)} paymentDate is more than ${String(MAX_PAYMENT_DATE_OFFSET_DAYS)} days from fileCreationDate: ${this.paymentDate.toISOString()}`
      );
    }
  }
}
