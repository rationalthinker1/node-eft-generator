import { EFTFileSpec } from '#EFTFileSpec';
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
    this.#validator.assertCompliantOutput(output);

    return output;
  }

  generateHeader(): string {
    const eftConfig = this.#builder.getConfiguration();
    const widths = EFTFileSpec.FIELD_WIDTHS;

    const fileCreationJulianDate = toPaddedJulianDate(
      eftConfig.fileCreationDate ?? new Date()
    );

    const dataCentre = EFTFileSpec.fixedField(
      eftConfig.destinationDataCentre,
      widths.dataCentre,
      RIGHT_ZERO
    );

    const destinationCurrency =
      eftConfig.destinationCurrency === undefined
        ? EFTFileSpec.fixedField('', widths.currency, LEFT_SPACE)
        : EFTFileSpec.fixedField(
            eftConfig.destinationCurrency,
            widths.currency,
            LEFT_SPACE
          );

    const record =
      // Logical Record Type Id
      RECORD_TYPE.HEADER +
      // Logical Record Count
      EFTFileSpec.fixedField('1', widths.logicalRecordCount, RIGHT_ZERO) +
      // Originator's Id / Client Number
      EFTFileSpec.fixedField(eftConfig.originatorId, widths.originatorId, LEFT_SPACE) +
      // File Creation Number
      EFTFileSpec.fixedField(
        eftConfig.fileCreationNumber,
        widths.fileCreationNumber,
        RIGHT_ZERO
      ) +
      // Creation Date (0YYDDD)
      fileCreationJulianDate +
      // Destination Data Centre
      dataCentre +
      // Reserved Customer Direct Clearer Communication Area
      EFTFileSpec.fixedField('', widths.reservedHeader, LEFT_SPACE) +
      // Currency Code Identifier
      destinationCurrency +
      // Filler
      EFTFileSpec.fixedField('', widths.headerFiller, LEFT_SPACE);

    return EFTFileSpec.assertRecordLength(record, 'header');
  }

  /**
   * Builds the logical record line for a single transaction. The validator
   * has already confirmed segments.length is between 1 and
   * MAX_SEGMENTS_PER_RECORD, so a single record always fits.
   */
  generateTransaction(transaction: EFTTransaction): string {
    const eftConfig = this.#builder.getConfiguration();
    const widths = EFTFileSpec.FIELD_WIDTHS;

    this.#recordCount += 1;

    if (transaction.recordType === TRANSACTION_TYPE.CREDIT) {
      this.#totalNumberCredits += 1;
    } else {
      this.#totalNumberDebits += 1;
    }

    let record =
      // Logical Record Type Id
      transaction.recordType +
      // Logical Record Count
      EFTFileSpec.fixedField(
        this.#recordCount.toString(),
        widths.logicalRecordCount,
        RIGHT_ZERO
      ) +
      // Origination Control Data
      EFTFileSpec.fixedField(eftConfig.originatorId, widths.originatorId, LEFT_SPACE) +
      EFTFileSpec.fixedField(
        eftConfig.fileCreationNumber,
        widths.fileCreationNumber,
        RIGHT_ZERO
      );

    // originatorShortName is required by the validator.
    const originatorShortName = eftConfig.originatorShortName ?? '';

    for (const [segmentIndex, segment] of transaction.segments.entries()) {
      const paymentJulianDate = toPaddedJulianDate(segment.paymentDate ?? new Date());

      const crossReferenceNumber =
        segment.crossReferenceNumber ??
        'F' +
          eftConfig.fileCreationNumber +
          'R' +
          this.#recordCount.toString() +
          'S' +
          (segmentIndex + 1).toString();

      // Positions 215-264 differ by record type. C: 39 blanks + 11 zeros.
      // D (page 64): zero-fill at 215-247 (MICR area defaults to zeros), 6 blanks at
      // 248-253, 11 zeros at 254-264.
      const trailingFiller =
        transaction.recordType === TRANSACTION_TYPE.DEBIT
          ? '0'.repeat(33) + ' '.repeat(6) + '0'.repeat(11)
          : ' '.repeat(39) + '0'.repeat(11);

      record +=
        // Transaction Type
        EFTFileSpec.fixedField(segment.cpaCode, widths.cpaCode, RIGHT_ZERO) +
        // Amount
        EFTFileSpec.fixedField(
          Math.round(segment.amount * 100).toString(),
          widths.amount,
          RIGHT_ZERO
        ) +
        // Credit: Date Funds to be Available / Debit: Due Date
        paymentJulianDate +
        // Institutional Identification Number (9 digits = 1 lead + 3 inst + 5 transit)
        EFTFileSpec.fixedField('', widths.institutionalIdLead, RIGHT_ZERO) +
        EFTFileSpec.fixedField(
          segment.bankInstitutionNumber,
          widths.institutionNumber,
          RIGHT_ZERO
        ) +
        EFTFileSpec.fixedField(
          segment.bankTransitNumber,
          widths.transitNumber,
          RIGHT_ZERO
        ) +
        // Credit: Payee Account Number / Debit: Payor Account Number
        EFTFileSpec.fixedField(
          segment.bankAccountNumber,
          widths.accountNumber,
          LEFT_SPACE
        ) +
        // Filler (zeros)
        EFTFileSpec.fixedField('', widths.segmentFillerZeros, RIGHT_ZERO) +
        // Originator's Short Name
        EFTFileSpec.fixedField(
          sanitizeCPA005Text(originatorShortName),
          widths.originatorShortName,
          LEFT_SPACE
        ) +
        // Credit: Payee Name / Debit: Payor Name
        EFTFileSpec.fixedField(
          sanitizeCPA005Text(segment.payeeName),
          widths.payeeName,
          LEFT_SPACE
        ) +
        // Originator's Long Name
        EFTFileSpec.fixedField(
          sanitizeCPA005Text(eftConfig.originatorLongName),
          widths.originatorLongName,
          LEFT_SPACE
        ) +
        // Filler (positions 165-174)
        EFTFileSpec.fixedField('', widths.segmentFillerBlanks, LEFT_SPACE) +
        // Cross Reference Number
        EFTFileSpec.fixedField(
          sanitizeCPA005Text(crossReferenceNumber),
          widths.crossReference,
          LEFT_SPACE
        ) +
        // Institutional ID Number for Returns (lead zero)
        EFTFileSpec.fixedField('', widths.institutionalIdLead, RIGHT_ZERO) +
        // Institution Number for Returns
        (eftConfig.returnInstitutionNumber === undefined
          ? EFTFileSpec.fixedField('', widths.institutionNumber, LEFT_SPACE)
          : EFTFileSpec.fixedField(
              eftConfig.returnInstitutionNumber,
              widths.institutionNumber,
              RIGHT_ZERO
            )) +
        // Transit Number for Returns
        (eftConfig.returnTransitNumber === undefined
          ? EFTFileSpec.fixedField('', widths.transitNumber, LEFT_SPACE)
          : EFTFileSpec.fixedField(
              eftConfig.returnTransitNumber,
              widths.transitNumber,
              RIGHT_ZERO
            )) +
        // Account Number for Returns
        EFTFileSpec.fixedField(
          eftConfig.returnAccountNumber ?? '',
          widths.accountNumber,
          LEFT_SPACE
        ) +
        trailingFiller;

      if (transaction.recordType === TRANSACTION_TYPE.CREDIT) {
        this.#totalValueCredits += segment.amount;
      } else {
        this.#totalValueDebits += segment.amount;
      }
    }

    return EFTFileSpec.assertRecordLength(
      record.padEnd(EFTFileSpec.RECORD_LENGTH, ' '),
      'transaction'
    );
  }

  generateTrailer(): string {
    const eftConfig = this.#builder.getConfiguration();
    const widths = EFTFileSpec.FIELD_WIDTHS;

    const record =
      // Logical Record Type Id
      RECORD_TYPE.TRAILER +
      // Logical Record Count
      EFTFileSpec.fixedField(
        (this.#recordCount + 1).toString(),
        widths.logicalRecordCount,
        RIGHT_ZERO
      ) +
      // Origination Control Data
      EFTFileSpec.fixedField(eftConfig.originatorId, widths.originatorId, LEFT_SPACE) +
      EFTFileSpec.fixedField(
        eftConfig.fileCreationNumber,
        widths.fileCreationNumber,
        RIGHT_ZERO
      ) +
      // Total Value of Debit Transactions
      EFTFileSpec.fixedField(
        Math.round(this.#totalValueDebits * 100).toString(),
        widths.totalValueDebits,
        RIGHT_ZERO
      ) +
      // Total Number of Debit Transactions
      EFTFileSpec.fixedField(
        this.#totalNumberDebits.toString(),
        widths.totalNumberDebits,
        RIGHT_ZERO
      ) +
      // Total Value of Credit Transactions
      EFTFileSpec.fixedField(
        Math.round(this.#totalValueCredits * 100).toString(),
        widths.totalValueCredits,
        RIGHT_ZERO
      ) +
      // Total Number of Credit Transactions
      EFTFileSpec.fixedField(
        this.#totalNumberCredits.toString(),
        widths.totalNumberCredits,
        RIGHT_ZERO
      ) +
      // Filler (positions 69-1464)
      EFTFileSpec.fixedField('', widths.trailerFiller, LEFT_SPACE);

    return EFTFileSpec.assertRecordLength(record, 'trailer');
  }

  #resetCounters(): void {
    this.#recordCount = 1;
    this.#totalValueDebits = 0;
    this.#totalNumberDebits = 0;
    this.#totalValueCredits = 0;
    this.#totalNumberCredits = 0;
  }
}
