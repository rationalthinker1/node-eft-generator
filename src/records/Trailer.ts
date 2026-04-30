import type { EFTFileBuilder } from '#EFTFileBuilder';
import { Field, renderFields } from '#records/Field';
import { Logger } from '#utils/Logger';
import {
  RECORD_TYPE,
  TRANSACTION_TYPE,
  type Loggable,
  type Printable,
  type Validable
} from '#domain/types';
import { assertRecordLength, sanitizeCPA005Text } from '#utils/index';

const RECORD_LENGTH = 1464;

export class Trailer implements Printable, Loggable, Validable {
  @Field({ start: 1, end: 1, pad: '0', align: 'right' })
  recordType = RECORD_TYPE.TRAILER;

  @Field({
    start: 2,
    end: 10,
    pad: '0',
    align: 'right',
    transform: (v) => (v as number).toString()
  })
  recordCount!: number;

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

  @Field({
    start: 25,
    end: 38,
    pad: '0',
    align: 'right',
    transform: (v) => Math.round((v as number) * 100).toString()
  })
  totalValueDebits!: number;

  @Field({
    start: 39,
    end: 46,
    pad: '0',
    align: 'right',
    transform: (v) => (v as number).toString()
  })
  totalNumberDebits!: number;

  @Field({
    start: 47,
    end: 60,
    pad: '0',
    align: 'right',
    transform: (v) => Math.round((v as number) * 100).toString()
  })
  totalValueCredits!: number;

  @Field({
    start: 61,
    end: 68,
    pad: '0',
    align: 'right',
    transform: (v) => (v as number).toString()
  })
  totalNumberCredits!: number;

  @Field({ start: 69, end: RECORD_LENGTH, pad: ' ', align: 'left' })
  trailerFiller = '';

  constructor(builder: EFTFileBuilder) {
    const cfg = builder.getConfiguration();
    const transactions = builder.getTransactions();

    let totalValueDebits = 0;
    let totalNumberDebits = 0;
    let totalValueCredits = 0;
    let totalNumberCredits = 0;

    for (const tx of transactions) {
      if (tx.recordType === TRANSACTION_TYPE.CREDIT) {
        totalNumberCredits += 1;
        for (const seg of tx.segments) totalValueCredits += seg.amount;
      } else {
        totalNumberDebits += 1;
        for (const seg of tx.segments) totalValueDebits += seg.amount;
      }
    }

    this.recordCount = 1 + transactions.length + 1; // header + N transactions + trailer
    this.originatorId = cfg.originatorId;
    this.fileCreationNumber = cfg.fileCreationNumber;
    this.totalValueDebits = totalValueDebits;
    this.totalNumberDebits = totalNumberDebits;
    this.totalValueCredits = totalValueCredits;
    this.totalNumberCredits = totalNumberCredits;
  }

  print(): string {
    this.log();
    return assertRecordLength(renderFields(this, Trailer), 'trailer', RECORD_LENGTH);
  }

  /**
   * Trailer is fully derived from inputs the validator already exercised
   * upstream (config via Header, segment values via Segment). Implemented
   * for symmetry with the Validable contract; no additional invariants
   * to check here.
   */
  validate(): void {
    // intentionally empty
  }

  log(): void {
    Logger.title('TRAILER');
    Logger.row('records', `<b>${this.recordCount.toString()}</b>`);
    Logger.row(
      'debits',
      `<b>${this.totalNumberDebits.toString().padStart(4)}</b>   <yellow>${Logger.fmtCurrency(this.totalValueDebits)}</yellow>`
    );
    Logger.row(
      'credits',
      `<b>${this.totalNumberCredits.toString().padStart(4)}</b>   <yellow>${Logger.fmtCurrency(this.totalValueCredits)}</yellow>`
    );
    Logger.endSection();
  }
}
