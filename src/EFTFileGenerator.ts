import type { EFTFileBuilder } from '#EFTFileBuilder';
import { EFTFileLogger } from '#EFTFileLogger';
import { EFTFileValidator, RECORD_LENGTH } from '#EFTFileValidator';
import { RECORD_TYPE, TRANSACTION_TYPE, type EFTTransaction } from '#types';
import {
  NEWLINE,
  assertRecordLength,
  containsProhibitedCharacters,
  fixedField,
  sanitizeCPA005Text,
  toPaddedJulianDate
} from '#utils';

const SEGMENT_LENGTH = 240;

interface Field {
  name: string;
  value: string;
  start: number;
  end: number;
  filler: ' ' | '0';
  align: 'left' | 'right';
}

export class EFTFileGenerator {
  readonly #builder: EFTFileBuilder;
  readonly #validator: EFTFileValidator;
  readonly #logger: EFTFileLogger;

  #recordCount = 1;
  #totalValueDebits = 0;
  #totalNumberDebits = 0;
  #totalValueCredits = 0;
  #totalNumberCredits = 0;

  /**
   * @param builder source of configuration and transactions
   * @param logger optional logger; defaults to a new EFTFileLogger instance.
   * Pass a custom subclass to redirect output, suppress logging, etc.
   */
  constructor(builder: EFTFileBuilder, logger?: EFTFileLogger) {
    this.#builder = builder;
    this.#validator = new EFTFileValidator(builder);
    this.#logger = logger ?? new EFTFileLogger();
  }

  generate(): string {
    this.#resetCounters();

    // Throws on any spec violation; aborts before any record is emitted.
    this.#validator.validate();

    const lines: string[] = [this.generateHeader()];

    for (const transaction of this.#builder.getTransactions()) {
      lines.push(this.generateTransaction(transaction));
    }

    lines.push(this.generateTrailer());

    const output = lines.join(NEWLINE);

    // End-of-pipeline file-level invariant check. Catches anything the
    // input validation and per-record assertions could miss.
    this.#validator.validateFile(output);

    return output;
  }

  generateHeader(): string {
    const eftConfig = this.#builder.getConfiguration();

    const fileCreationDate = eftConfig.fileCreationDate ?? new Date();
    const fileCreationJulianDate = toPaddedJulianDate(fileCreationDate);
    const originatorId = sanitizeCPA005Text(eftConfig.originatorId);

    const fields: Field[] = [
      {
        name: 'recordType',
        value: RECORD_TYPE.HEADER,
        start: 1,
        end: 1,
        filler: '0',
        align: 'right'
      },
      {
        name: 'logicalRecordCount',
        value: '1',
        start: 2,
        end: 10,
        filler: '0',
        align: 'right'
      },
      {
        name: 'originatorId',
        value: originatorId,
        start: 11,
        end: 20,
        filler: ' ',
        align: 'left'
      },
      {
        name: 'fileCreationNumber',
        value: eftConfig.fileCreationNumber,
        start: 21,
        end: 24,
        filler: '0',
        align: 'right'
      },
      {
        name: 'fileCreationJulianDate',
        value: fileCreationJulianDate,
        start: 25,
        end: 30,
        filler: '0',
        align: 'right'
      },
      {
        name: 'destinationDataCentre',
        value: eftConfig.destinationDataCentre,
        start: 31,
        end: 35,
        filler: '0',
        align: 'right'
      },
      {
        name: 'reservedHeader',
        value: '',
        start: 36,
        end: 55,
        filler: ' ',
        align: 'left'
      },
      {
        name: 'destinationCurrency',
        value: eftConfig.destinationCurrency ?? '',
        start: 56,
        end: 58,
        filler: ' ',
        align: 'left'
      },
      {
        name: 'headerFiller',
        value: '',
        start: 59,
        end: 1464,
        filler: ' ',
        align: 'left'
      }
    ];

    this.#logger.logHeader({
      originatorId,
      fileCreationNumber: eftConfig.fileCreationNumber,
      fileCreationDate,
      fileCreationJulianDate,
      destinationDataCentre: eftConfig.destinationDataCentre,
      destinationCurrency: eftConfig.destinationCurrency ?? '(default)'
    });

    return this.#assembleRecord(fields, 'header');
  }

  /**
   * Builds the logical record line for a single transaction. The validator
   * has already confirmed segments.length is between 1 and
   * MAX_SEGMENTS_PER_RECORD, so a single record always fits.
   */
  generateTransaction(transaction: EFTTransaction): string {
    const eftConfig = this.#builder.getConfiguration();

    this.#recordCount += 1;

    if (transaction.recordType === TRANSACTION_TYPE.CREDIT) {
      this.#totalNumberCredits += 1;
    } else {
      this.#totalNumberDebits += 1;
    }

    const fields: Field[] = [
      {
        name: 'recordType',
        value: transaction.recordType,
        start: 1,
        end: 1,
        filler: '0',
        align: 'right'
      },
      {
        name: 'logicalRecordCount',
        value: this.#recordCount.toString(),
        start: 2,
        end: 10,
        filler: '0',
        align: 'right'
      },
      {
        name: 'originatorId',
        value: sanitizeCPA005Text(eftConfig.originatorId),
        start: 11,
        end: 20,
        filler: ' ',
        align: 'left'
      },
      {
        name: 'fileCreationNumber',
        value: eftConfig.fileCreationNumber,
        start: 21,
        end: 24,
        filler: '0',
        align: 'right'
      }
    ];

    for (const [segmentIndex, segment] of transaction.segments.entries()) {
      const offset = SEGMENT_LENGTH * segmentIndex;

      const crossReferenceNumber = sanitizeCPA005Text(
        segment.crossReferenceNumber ??
          'F' +
            eftConfig.fileCreationNumber +
            'R' +
            this.#recordCount.toString() +
            'S' +
            (segmentIndex + 1).toString()
      );
      const payeeName = sanitizeCPA005Text(segment.payeeName);

      const returnInst = eftConfig.returnInstitutionNumber;
      const returnTransit = eftConfig.returnTransitNumber;

      this.#logger.logSegment({
        recordType: transaction.recordType,
        recordNumber: this.#recordCount,
        segmentIndex,
        crossReferenceNumber,
        payeeName,
        amount: segment.amount,
        bankInstitutionNumber: segment.bankInstitutionNumber,
        bankTransitNumber: segment.bankTransitNumber,
        bankAccountNumber: segment.bankAccountNumber,
        cpaCode: segment.cpaCode,
        paymentDate: segment.paymentDate,
        paymentJulianDate: toPaddedJulianDate(segment.paymentDate),
        ...(containsProhibitedCharacters(segment.payeeName)
          ? {
              warning: `payeeName contains prohibited characters and will be sanitized: ${segment.payeeName}`
            }
          : {})
      });

      if (transaction.recordType === TRANSACTION_TYPE.CREDIT) {
        this.#totalValueCredits += segment.amount;
      } else {
        this.#totalValueDebits += segment.amount;
      }

      fields.push(
        {
          name: 'cpaCode',
          value: segment.cpaCode,
          start: offset + 25,
          end: offset + 27,
          filler: '0',
          align: 'right'
        },
        {
          name: 'amount',
          value: Math.round(segment.amount * 100).toString(),
          start: offset + 28,
          end: offset + 37,
          filler: '0',
          align: 'right'
        },
        {
          name: 'paymentJulianDate',
          value: toPaddedJulianDate(segment.paymentDate),
          start: offset + 38,
          end: offset + 43,
          filler: '0',
          align: 'right'
        },
        {
          name: 'institutionalIdLead',
          value: '',
          start: offset + 44,
          end: offset + 44,
          filler: '0',
          align: 'right'
        },
        {
          name: 'bankInstitutionNumber',
          value: segment.bankInstitutionNumber,
          start: offset + 45,
          end: offset + 47,
          filler: '0',
          align: 'right'
        },
        {
          name: 'bankTransitNumber',
          value: segment.bankTransitNumber,
          start: offset + 48,
          end: offset + 52,
          filler: '0',
          align: 'right'
        },
        {
          name: 'bankAccountNumber',
          value: segment.bankAccountNumber,
          start: offset + 53,
          end: offset + 64,
          filler: ' ',
          align: 'left'
        },
        {
          name: 'segmentFillerZeros',
          value: '',
          start: offset + 65,
          end: offset + 89,
          filler: '0',
          align: 'right'
        },
        {
          name: 'originatorShortName',
          value: sanitizeCPA005Text(eftConfig.originatorShortName),
          start: offset + 90,
          end: offset + 104,
          filler: ' ',
          align: 'left'
        },
        {
          name: 'payeeName',
          value: payeeName,
          start: offset + 105,
          end: offset + 134,
          filler: ' ',
          align: 'left'
        },
        {
          name: 'originatorLongName',
          value: sanitizeCPA005Text(eftConfig.originatorLongName),
          start: offset + 135,
          end: offset + 164,
          filler: ' ',
          align: 'left'
        },
        {
          name: 'segmentFillerBlanks',
          value: '',
          start: offset + 165,
          end: offset + 174,
          filler: ' ',
          align: 'left'
        },
        {
          name: 'crossReferenceNumber',
          value: crossReferenceNumber,
          start: offset + 175,
          end: offset + 193,
          filler: ' ',
          align: 'left'
        },
        {
          name: 'returnInstitutionalIdLead',
          value: '',
          start: offset + 194,
          end: offset + 194,
          filler: '0',
          align: 'right'
        },
        {
          name: 'returnInstitutionNumber',
          value: returnInst ?? '',
          start: offset + 195,
          end: offset + 197,
          filler: returnInst === undefined ? ' ' : '0',
          align: returnInst === undefined ? 'left' : 'right'
        },
        {
          name: 'returnTransitNumber',
          value: returnTransit ?? '',
          start: offset + 198,
          end: offset + 202,
          filler: returnTransit === undefined ? ' ' : '0',
          align: returnTransit === undefined ? 'left' : 'right'
        },
        {
          name: 'returnAccountNumber',
          value: eftConfig.returnAccountNumber ?? '',
          start: offset + 203,
          end: offset + 214,
          filler: ' ',
          align: 'left'
        },
        {
          name: 'trailingFiller',
          value: transaction.recordType === TRANSACTION_TYPE.DEBIT
            ? '0'.repeat(33) + ' '.repeat(6) + '0'.repeat(11)
            : ' '.repeat(39) + '0'.repeat(11),
          start: offset + 215,
          end: offset + 264,
          filler: ' ',
          align: 'left'
        }
      );
    }

    return this.#assembleRecord(fields, 'transaction');
  }

  generateTrailer(): string {
    const eftConfig = this.#builder.getConfiguration();

    const fields: Field[] = [
      {
        name: 'recordType',
        value: RECORD_TYPE.TRAILER,
        start: 1,
        end: 1,
        filler: '0',
        align: 'right'
      },
      {
        name: 'logicalRecordCount',
        value: (this.#recordCount + 1).toString(),
        start: 2,
        end: 10,
        filler: '0',
        align: 'right'
      },
      {
        name: 'originatorId',
        value: sanitizeCPA005Text(eftConfig.originatorId),
        start: 11,
        end: 20,
        filler: ' ',
        align: 'left'
      },
      {
        name: 'fileCreationNumber',
        value: eftConfig.fileCreationNumber,
        start: 21,
        end: 24,
        filler: '0',
        align: 'right'
      },
      {
        name: 'totalValueDebits',
        value: Math.round(this.#totalValueDebits * 100).toString(),
        start: 25,
        end: 38,
        filler: '0',
        align: 'right'
      },
      {
        name: 'totalNumberDebits',
        value: this.#totalNumberDebits.toString(),
        start: 39,
        end: 46,
        filler: '0',
        align: 'right'
      },
      {
        name: 'totalValueCredits',
        value: Math.round(this.#totalValueCredits * 100).toString(),
        start: 47,
        end: 60,
        filler: '0',
        align: 'right'
      },
      {
        name: 'totalNumberCredits',
        value: this.#totalNumberCredits.toString(),
        start: 61,
        end: 68,
        filler: '0',
        align: 'right'
      },
      {
        name: 'trailerFiller',
        value: '',
        start: 69,
        end: 1464,
        filler: ' ',
        align: 'left'
      }
    ];

    this.#logger.logTrailer({
      totalRecordCount: this.#recordCount + 1,
      debitCount: this.#totalNumberDebits,
      debitValue: this.#totalValueDebits,
      creditCount: this.#totalNumberCredits,
      creditValue: this.#totalValueCredits
    });

    return this.#assembleRecord(fields, 'trailer');
  }

  #resetCounters(): void {
    this.#recordCount = 1;
    this.#totalValueDebits = 0;
    this.#totalNumberDebits = 0;
    this.#totalValueCredits = 0;
    this.#totalNumberCredits = 0;
  }

  /**
   * Map each field to its padded fixed-width string, join, pad the result
   * to RECORD_LENGTH (in case the fields don't cover the full record —
   * e.g., a transaction with fewer than 6 segments), and assert the final
   * length. The padEnd is a no-op for header / trailer where the last
   * field already extends to position 1464.
   */
  #assembleRecord(fields: Field[], kind: string): string {
    const record = fields.map((f) =>
      fixedField(f.value, f.end - f.start + 1, {
        align: f.align,
        pad: f.filler
      })
    );
    return assertRecordLength(
      record.join('').padEnd(RECORD_LENGTH, ' '),
      kind,
      RECORD_LENGTH
    );
  }
}
