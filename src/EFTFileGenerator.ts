import { FIELD_WIDTHS, RECORD_LENGTH, assertRecordLength, fixedField } from '#cpa005Spec';
import type { EFTFileBuilder } from '#EFTFileBuilder';
import { EFTFileValidator } from '#EFTFileValidator';
import { RECORD_TYPE, TRANSACTION_TYPE, type EFTTransaction } from '#types';
import { NEWLINE, sanitizeCPA005Text, toPaddedJulianDate } from '#utils';

const RIGHT_ZERO = { align: 'right', pad: '0' } as const;
const LEFT_SPACE = { align: 'left', pad: ' ' } as const;

export class EFTFileGenerator {
  readonly #builder: EFTFileBuilder;
  readonly #validator: EFTFileValidator;

  #recordCount = 1;
  #totalValueDebits = 0;
  #totalNumberDebits = 0;
  #totalValueCredits = 0;
  #totalNumberCredits = 0;

  constructor(builder: EFTFileBuilder) {
    this.#builder = builder;
    this.#validator = new EFTFileValidator(builder);
  }

  generate(): string {
    this.#resetCounters();

    const validationWarnings = this.#validator.validate();
    if (validationWarnings.length > 0) {
      console.debug(
        `Proceeding with ${String(validationWarnings.length)} warnings.`,
        validationWarnings
      );
    }

    const lines: string[] = [this.generateHeader()];

    for (const transaction of this.#builder.getTransactions()) {
      lines.push(...this.generateTransaction(transaction));
    }

    lines.push(this.generateTrailer());

    return lines.join(NEWLINE);
  }

  generateHeader(): string {
    const eftConfig = this.#builder.getConfiguration();

    const fileCreationJulianDate = toPaddedJulianDate(
      eftConfig.fileCreationDate ?? new Date()
    );

    const dataCentre =
      eftConfig.destinationDataCentre === undefined
        ? fixedField('', FIELD_WIDTHS.dataCentre, LEFT_SPACE)
        : fixedField(
            eftConfig.destinationDataCentre,
            FIELD_WIDTHS.dataCentre,
            RIGHT_ZERO
          );

    const destinationCurrency =
      eftConfig.destinationCurrency === undefined
        ? fixedField('', FIELD_WIDTHS.currency, LEFT_SPACE)
        : fixedField(eftConfig.destinationCurrency, FIELD_WIDTHS.currency, LEFT_SPACE);

    const record =
      // Logical Record Type Id
      RECORD_TYPE.HEADER +
      // Logical Record Count
      fixedField('1', FIELD_WIDTHS.logicalRecordCount, RIGHT_ZERO) +
      // Originator's Id / Client Number
      fixedField(eftConfig.originatorId, FIELD_WIDTHS.originatorId, LEFT_SPACE) +
      // File Creation Number
      fixedField(
        eftConfig.fileCreationNumber,
        FIELD_WIDTHS.fileCreationNumber,
        RIGHT_ZERO
      ) +
      // Creation Date (0YYDDD)
      fileCreationJulianDate +
      // Destination Data Centre
      dataCentre +
      // Reserved Customer Direct Clearer Communication Area
      fixedField('', FIELD_WIDTHS.reservedHeader, LEFT_SPACE) +
      // Currency Code Identifier
      destinationCurrency +
      // Filler
      fixedField('', FIELD_WIDTHS.headerFiller, LEFT_SPACE);

    return assertRecordLength(record, 'header');
  }

  /**
   * Builds the logical record line(s) for a single transaction. A transaction
   * with more than 6 segments is split across multiple records.
   * Updates running counters used by {@link generateTrailer}.
   */
  generateTransaction(transaction: EFTTransaction): string[] {
    const eftConfig = this.#builder.getConfiguration();
    const lines: string[] = [];
    let record = '';

    for (const [segmentIndex, segment] of transaction.segments.entries()) {
      if (segmentIndex % 6 === 0) {
        if (segmentIndex > 0) {
          lines.push(assertRecordLength(record, 'transaction'));
        }

        this.#recordCount += 1;

        if (transaction.recordType === TRANSACTION_TYPE.CREDIT) {
          this.#totalNumberCredits += 1;
        } else {
          this.#totalNumberDebits += 1;
        }

        record =
          // Logical Record Type Id
          transaction.recordType +
          // Logical Record Count
          fixedField(
            this.#recordCount.toString(),
            FIELD_WIDTHS.logicalRecordCount,
            RIGHT_ZERO
          ) +
          // Origination Control Data
          fixedField(eftConfig.originatorId, FIELD_WIDTHS.originatorId, LEFT_SPACE) +
          fixedField(
            eftConfig.fileCreationNumber,
            FIELD_WIDTHS.fileCreationNumber,
            RIGHT_ZERO
          );
      }

      const paymentJulianDate = toPaddedJulianDate(segment.paymentDate ?? new Date());

      let crossReferenceNumber = segment.crossReferenceNumber;

      crossReferenceNumber ??=
        'F' +
        eftConfig.fileCreationNumber +
        'R' +
        this.#recordCount.toString() +
        'S' +
        (segmentIndex + 1).toString();

      const originatorShortName =
        eftConfig.originatorShortName ?? eftConfig.originatorLongName;

      // Positions 215-264 differ by record type. C: 39 blanks + 11 zeros.
      // D (page 64): zero-fill at 215-247 (MICR area defaults to zeros), 6 blanks at
      // 248-253, 11 zeros at 254-264.
      const trailingFiller =
        transaction.recordType === TRANSACTION_TYPE.DEBIT
          ? '0'.repeat(33) + ' '.repeat(6) + '0'.repeat(11)
          : ' '.repeat(39) + '0'.repeat(11);

      record +=
        // Transaction Type
        fixedField(segment.cpaCode, FIELD_WIDTHS.cpaCode, RIGHT_ZERO) +
        // Amount
        fixedField(
          Math.round(segment.amount * 100).toString(),
          FIELD_WIDTHS.amount,
          RIGHT_ZERO
        ) +
        // Credit: Date Funds to be Available
        // Debit: Due Date
        paymentJulianDate +
        // Institutional Identification Number (9 digits)
        fixedField('', FIELD_WIDTHS.institutionalIdLead, RIGHT_ZERO) +
        fixedField(
          segment.bankInstitutionNumber,
          FIELD_WIDTHS.institutionNumber,
          RIGHT_ZERO
        ) +
        fixedField(segment.bankTransitNumber, FIELD_WIDTHS.transitNumber, RIGHT_ZERO) +
        // Credit: Payee Account Number
        // Debit: Payor Account Number
        fixedField(segment.bankAccountNumber, FIELD_WIDTHS.accountNumber, LEFT_SPACE) +
        // Filler (zeros)
        fixedField('', FIELD_WIDTHS.segmentFillerZeros, RIGHT_ZERO) +
        // Originator's Short Name
        sanitizeCPA005Text(originatorShortName)
          .padEnd(FIELD_WIDTHS.originatorShortName, ' ')
          .slice(0, FIELD_WIDTHS.originatorShortName) +
        // Credit: Payee Name
        // Debit: Payor Name
        sanitizeCPA005Text(segment.payeeName)
          .padEnd(FIELD_WIDTHS.payeeName, ' ')
          .slice(0, FIELD_WIDTHS.payeeName) +
        // Originator's Long Name
        sanitizeCPA005Text(eftConfig.originatorLongName)
          .padEnd(FIELD_WIDTHS.originatorLongName, ' ')
          .slice(0, FIELD_WIDTHS.originatorLongName) +
        // Filler (positions 165-174)
        fixedField('', FIELD_WIDTHS.segmentFillerBlanks, LEFT_SPACE) +
        // Cross Reference Number
        sanitizeCPA005Text(crossReferenceNumber)
          .padEnd(FIELD_WIDTHS.crossReference, ' ')
          .slice(0, FIELD_WIDTHS.crossReference) +
        // Institutional ID Number for Returns
        fixedField('', FIELD_WIDTHS.institutionalIdLead, RIGHT_ZERO) +
        // Institution Number for Returns
        (eftConfig.returnInstitutionNumber === undefined
          ? fixedField('', FIELD_WIDTHS.institutionNumber, LEFT_SPACE)
          : fixedField(
              eftConfig.returnInstitutionNumber,
              FIELD_WIDTHS.institutionNumber,
              RIGHT_ZERO
            )) +
        // Transit Number for Returns
        (eftConfig.returnTransitNumber === undefined
          ? fixedField('', FIELD_WIDTHS.transitNumber, LEFT_SPACE)
          : fixedField(
              eftConfig.returnTransitNumber,
              FIELD_WIDTHS.transitNumber,
              RIGHT_ZERO
            )) +
        // Account Number for Returns
        fixedField(
          eftConfig.returnAccountNumber ?? '',
          FIELD_WIDTHS.accountNumber,
          LEFT_SPACE
        ) +
        trailingFiller;

      if (transaction.recordType === TRANSACTION_TYPE.CREDIT) {
        this.#totalValueCredits += segment.amount;
      } else {
        this.#totalValueDebits += segment.amount;
      }
    }

    if (record !== '') {
      // Pad the final record (which may have fewer than 6 segments) up to
      // RECORD_LENGTH, then assert the result.
      lines.push(assertRecordLength(record.padEnd(RECORD_LENGTH, ' '), 'transaction'));
    }

    return lines;
  }

  generateTrailer(): string {
    const eftConfig = this.#builder.getConfiguration();

    const record =
      // Logical Record Type Id
      RECORD_TYPE.TRAILER +
      // Logical Record Count
      fixedField(
        (this.#recordCount + 1).toString(),
        FIELD_WIDTHS.logicalRecordCount,
        RIGHT_ZERO
      ) +
      // Origination Control Data
      fixedField(eftConfig.originatorId, FIELD_WIDTHS.originatorId, LEFT_SPACE) +
      fixedField(
        eftConfig.fileCreationNumber,
        FIELD_WIDTHS.fileCreationNumber,
        RIGHT_ZERO
      ) +
      // Total Value of Debit Transactions
      fixedField(
        Math.round(this.#totalValueDebits * 100).toString(),
        FIELD_WIDTHS.totalValueDebits,
        RIGHT_ZERO
      ) +
      // Total Number of Debit Transactions
      fixedField(
        this.#totalNumberDebits.toString(),
        FIELD_WIDTHS.totalNumberDebits,
        RIGHT_ZERO
      ) +
      // Total Value of Credit Transactions
      fixedField(
        Math.round(this.#totalValueCredits * 100).toString(),
        FIELD_WIDTHS.totalValueCredits,
        RIGHT_ZERO
      ) +
      // Total Number of Credit Transactions
      fixedField(
        this.#totalNumberCredits.toString(),
        FIELD_WIDTHS.totalNumberCredits,
        RIGHT_ZERO
      ) +
      // Filler (positions 69-1464)
      fixedField('', FIELD_WIDTHS.trailerFiller, LEFT_SPACE);

    return assertRecordLength(record, 'trailer');
  }

  #resetCounters(): void {
    this.#recordCount = 1;
    this.#totalValueDebits = 0;
    this.#totalNumberDebits = 0;
    this.#totalValueCredits = 0;
    this.#totalNumberCredits = 0;
  }
}
