import type { EFTFileBuilder } from '#EFTFileBuilder';
import { EFTFileValidator } from '#EFTFileValidator';
import { RECORD_TYPE, TRANSACTION_TYPE, type EFTTransaction } from '#types';
import {
  NEWLINE,
  sanitizeCPA005Text,
  toPaddedJulianDate
} from '#utils';

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
        `Proceeding with ${validationWarnings.length} warnings.`,
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

    let dataCentre = ''.padEnd(5, ' ');
    if (eftConfig.destinationDataCentre !== undefined) {
      dataCentre = eftConfig.destinationDataCentre.padStart(5, '0');
    }

    let destinationCurrency = ''.padEnd(3, ' ');
    if (eftConfig.destinationCurrency !== undefined) {
      destinationCurrency = eftConfig.destinationCurrency;
    }

    return (
      // Logical Record Type Id
      RECORD_TYPE.HEADER +
      // Logical Record Count
      '1'.padStart(9, '0') +
      // Originator's Id / Client Number
      eftConfig.originatorId.padEnd(10, ' ') +
      // File Creation Number
      eftConfig.fileCreationNumber.padStart(4, '0').slice(-4) +
      // Creation Date (0YYDDD)
      fileCreationJulianDate +
      // Destination Data Centre
      dataCentre +
      // Reserved Customer Direct Clearer Communication Area
      ''.padEnd(20, ' ') +
      // Currency Code Identifier
      destinationCurrency +
      // Filler
      ''.padEnd(1406, ' ')
    );
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

    for (
      let segmentIndex = 0;
      segmentIndex < transaction.segments.length;
      segmentIndex += 1
    ) {
      if (segmentIndex % 6 === 0) {
        if (segmentIndex > 0) {
          lines.push(record);
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
          this.#recordCount.toString().padStart(9, '0') +
          // Origination Control Data
          eftConfig.originatorId.padEnd(10, ' ') +
          eftConfig.fileCreationNumber.padStart(4, '0');
      }

      const segment = transaction.segments[segmentIndex];

      const paymentJulianDate = toPaddedJulianDate(
        segment.paymentDate ?? new Date()
      );

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
        segment.cpaCode +
        // Amount
        Math.round(segment.amount * 100)
          .toString()
          .padStart(10, '0') +
        // Credit: Date Funds to be Available
        // Debit: Due Date
        paymentJulianDate +
        // Institutional Identification Number (9 digits)
        ''.padStart(1, '0') +
        segment.bankInstitutionNumber.padStart(3, '0') +
        segment.bankTransitNumber.padStart(5, '0') +
        // Credit: Payee Account Number
        // Debit: Payor Account Number
        segment.bankAccountNumber.padEnd(12, ' ') +
        // Filler (zeros)
        ''.padStart(25, '0') +
        // Originator's Short Name
        sanitizeCPA005Text(originatorShortName).padEnd(15, ' ').slice(0, 15) +
        // Credit: Payee Name
        // Debit: Payor Name
        sanitizeCPA005Text(segment.payeeName).padEnd(30, ' ').slice(0, 30) +
        // Originator's Long Name
        sanitizeCPA005Text(eftConfig.originatorLongName)
          .padEnd(30, ' ')
          .slice(0, 30) +
        // Filler (positions 165-174)
        ''.padEnd(10, ' ') +
        // Cross Reference Number
        sanitizeCPA005Text(crossReferenceNumber).padEnd(19, ' ').slice(0, 19) +
        // Institutional ID Number for Returns
        ''.padStart(1, '0') +
        // Institution Number for Returns
        (eftConfig.returnInstitutionNumber === undefined
          ? ''.padEnd(3, ' ')
          : eftConfig.returnInstitutionNumber.padStart(3, '0')) +
        // Transit Number for Returns
        (eftConfig.returnTransitNumber === undefined
          ? ''.padEnd(5, ' ')
          : eftConfig.returnTransitNumber.padStart(5, '0')) +
        // Account Number for Returns
        (eftConfig.returnAccountNumber ?? '').padEnd(12, ' ') +
        trailingFiller;

      if (transaction.recordType === TRANSACTION_TYPE.CREDIT) {
        this.#totalValueCredits += segment.amount;
      } else {
        this.#totalValueDebits += segment.amount;
      }
    }

    if (record !== '') {
      lines.push(record.padEnd(1464, ' '));
    }

    return lines;
  }

  generateTrailer(): string {
    const eftConfig = this.#builder.getConfiguration();

    return (
      // Logical Record Type Id
      RECORD_TYPE.TRAILER +
      // Logical Record Count
      (this.#recordCount + 1).toString().padStart(9, '0') +
      // Origination Control Data
      eftConfig.originatorId.padEnd(10, ' ') +
      eftConfig.fileCreationNumber.padStart(4, '0').slice(-4) +
      // Total Value of Debit Transactions
      Math.round(this.#totalValueDebits * 100)
        .toString()
        .padStart(14, '0') +
      // Total Number of Debit Transactions
      this.#totalNumberDebits.toString().padStart(8, '0') +
      // Total Value of Credit Transactions
      Math.round(this.#totalValueCredits * 100)
        .toString()
        .padStart(14, '0') +
      // Total Number of Credit Transactions
      this.#totalNumberCredits.toString().padStart(8, '0') +
      // Filler (positions 69-1464)
      ''.padEnd(1396, ' ')
    );
  }

  #resetCounters(): void {
    this.#recordCount = 1;
    this.#totalValueDebits = 0;
    this.#totalNumberDebits = 0;
    this.#totalValueCredits = 0;
    this.#totalNumberCredits = 0;
  }
}
