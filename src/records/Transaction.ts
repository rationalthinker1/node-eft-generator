import type { EFTFileBuilder } from '#EFTFileBuilder';
import { Field, renderFields, validateFields } from '#records/Field';
import { Segment } from '#records/Segment';
import {
  TRANSACTION_TYPE,
  type EFTTransaction,
  type Loggable,
  type Printable,
  type Validable,
  type TransactionType
} from '#types';
import { assertRecordLength, sanitizeCPA005Text } from '#utils/index';

const RECORD_LENGTH = 1464;
export const MAX_SEGMENTS_PER_RECORD = 6;

/**
 * One CPA-005 transaction record (1464 chars). Holds a 24-char prefix
 * (recordType, logicalRecordCount, originatorId, fileCreationNumber) and
 * 1 to 6 240-char segments. print() concatenates prefix + segments and
 * pads to RECORD_LENGTH.
 */
export class Transaction implements Printable, Loggable, Validable {
  @Field({
    start: 1,
    end: 1,
    pad: '0',
    align: 'right',
    validate: (value) => {
      if (value !== TRANSACTION_TYPE.CREDIT && value !== TRANSACTION_TYPE.DEBIT) {
        throw new Error(`Unsupported recordType: ${value}`);
      }
    }
  })
  recordType!: TransactionType;

  @Field({
    start: 2,
    end: 10,
    pad: '0',
    align: 'right',
    transform: (v) => (v as number).toString()
  })
  recordNumber!: number;

  @Field({
    start: 11,
    end: 20,
    pad: ' ',
    align: 'left',
    transform: (v) => sanitizeCPA005Text(v as string)
  })
  originatorId!: string;

  @Field({ start: 21, end: 24, pad: '0', align: 'right' })
  fileCreationNumber!: string;

  segments!: Segment[];

  constructor(builder: EFTFileBuilder, tx: EFTTransaction, recordNumber: number) {
    const cfg = builder.getConfiguration();
    this.recordType = tx.recordType;
    this.recordNumber = recordNumber;
    this.originatorId = cfg.originatorId;
    this.fileCreationNumber = cfg.fileCreationNumber;
    this.segments = tx.segments.map(
      (seg, i) => new Segment(builder, seg, tx.recordType, recordNumber, i)
    );
  }

  isCredit(): boolean {
    return this.recordType === TRANSACTION_TYPE.CREDIT;
  }

  isDebit(): boolean {
    return this.recordType === TRANSACTION_TYPE.DEBIT;
  }

  print(): string {
    this.log();
    const prefix = renderFields(this, Transaction);
    const segmentsStr = this.segments.map((s) => s.print()).join('');
    return assertRecordLength(
      (prefix + segmentsStr).padEnd(RECORD_LENGTH, ' '),
      'transaction',
      RECORD_LENGTH
    );
  }

  log(): void {
    for (const segment of this.segments) {
      segment.log();
    }
  }

  /**
   * Validates this transaction's record-level invariants and recurses
   * into each segment. The transaction-index reported in error messages
   * is the 0-based position in the input list (recordNumber - 2; record 1
   * is the file header, so the first transaction is record 2).
   */
  validate(): void {
    const transactionIndex = this.recordNumber - 2;

    validateFields(this, Transaction);

    if (this.segments.length === 0) {
      throw new Error(`Transaction ${String(transactionIndex)} has no segments.`);
    }
    if (this.segments.length > MAX_SEGMENTS_PER_RECORD) {
      throw new Error(
        `Transaction ${String(transactionIndex)} has more than ${String(MAX_SEGMENTS_PER_RECORD)} segments; split into multiple transactions.`
      );
    }

    for (const segment of this.segments) segment.validate();
  }
}
