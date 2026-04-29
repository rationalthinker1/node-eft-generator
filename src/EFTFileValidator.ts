import { EFTFileSpec } from '#EFTFileSpec';
import type { EFTFileBuilder } from '#EFTFileBuilder';
import { TRANSACTION_TYPE, type EFTConfiguration, type EFTTransaction } from '#types';
import { containsProhibitedCharacters } from '#utils';

const MS_PER_DAY = 86_400_000;
const MAX_PAYMENT_DATE_OFFSET_DAYS = 173;
const MAX_PAYMENT_DATE_OFFSET_MS = MAX_PAYMENT_DATE_OFFSET_DAYS * MS_PER_DAY;

/**
 * Validates an `EFTFileBuilder` against the CPA-005 specification.
 *
 * Throws on every spec violation. There are no warnings — callers must
 * supply input that already conforms to the spec. The validator is run
 * automatically by `EFTFileGenerator.generate()`, so any throw aborts
 * file generation before any record is emitted.
 */
export class EFTFileValidator {
  readonly #builder: EFTFileBuilder;

  constructor(builder: EFTFileBuilder) {
    this.#builder = builder;
  }

  validate(): void {
    this.validateConfig(this.#builder.getConfiguration());
    this.validateTransactions(this.#builder.getTransactions());
  }

  validateConfig(eftConfig: EFTConfiguration): void {
    if (eftConfig.originatorId.length > EFTFileSpec.FIELD_WIDTHS.originatorId) {
      throw new Error(
        `originatorId length exceeds ${String(EFTFileSpec.FIELD_WIDTHS.originatorId)}: ${eftConfig.originatorId}`
      );
    }

    if (!/^\d{1,4}$/.test(eftConfig.fileCreationNumber)) {
      throw new Error(
        `fileCreationNumber should be 1 to 4 digits: ${eftConfig.fileCreationNumber}`
      );
    }

    if (!/^\d{0,5}$/.test(eftConfig.destinationDataCentre ?? '')) {
      throw new Error(
        `destinationDataCentre should be 1 to 5 digits: ${eftConfig.destinationDataCentre ?? '<unset>'}`
      );
    }

    if (eftConfig.originatorShortName === undefined) {
      throw new Error('originatorShortName is required.');
    }

    if (
      eftConfig.originatorShortName.length > EFTFileSpec.FIELD_WIDTHS.originatorShortName
    ) {
      throw new Error(
        `originatorShortName exceeds ${String(EFTFileSpec.FIELD_WIDTHS.originatorShortName)} characters: ${eftConfig.originatorShortName}`
      );
    }

    if (containsProhibitedCharacters(eftConfig.originatorShortName)) {
      throw new Error(
        `originatorShortName contains prohibited characters: ${eftConfig.originatorShortName}`
      );
    }

    if (
      eftConfig.originatorLongName.length > EFTFileSpec.FIELD_WIDTHS.originatorLongName
    ) {
      throw new Error(
        `originatorLongName exceeds ${String(EFTFileSpec.FIELD_WIDTHS.originatorLongName)} characters: ${eftConfig.originatorLongName}`
      );
    }

    if (containsProhibitedCharacters(eftConfig.originatorLongName)) {
      throw new Error(
        `originatorLongName contains prohibited characters: ${eftConfig.originatorLongName}`
      );
    }

    if (!['', 'CAD', 'USD'].includes(eftConfig.destinationCurrency ?? '')) {
      throw new Error(
        `Unsupported destinationCurrency: ${eftConfig.destinationCurrency ?? '<unset>'}`
      );
    }

    // returnInstitutionNumber / returnTransitNumber / returnAccountNumber are
    // validated at construction time by their branded constructors. Here we
    // only check the all-or-nothing requirement.
    const returnFields = [
      eftConfig.returnInstitutionNumber,
      eftConfig.returnTransitNumber,
      eftConfig.returnAccountNumber
    ];
    const returnFieldsDefined = returnFields.filter((f) => f !== undefined).length;

    if (returnFieldsDefined > 0 && returnFieldsDefined < returnFields.length) {
      throw new Error(
        'returnInstitutionNumber, returnTransitNumber, and returnAccountNumber must be defined together, or not defined at all.'
      );
    }
  }

  validateTransactions(eftTransactions: EFTTransaction[]): void {
    if (eftTransactions.length === 0) {
      throw new Error('There are no transactions in this file.');
    }
    if (eftTransactions.length > EFTFileSpec.MAX_FILE_TRANSACTION_COUNT) {
      throw new Error(
        `Transaction count exceeds ${String(EFTFileSpec.MAX_FILE_TRANSACTION_COUNT)}.`
      );
    }

    const fileCreationDate =
      this.#builder.getConfiguration().fileCreationDate ?? new Date();

    const crossReferenceNumbers = new Set<string>();

    for (const [transactionIndex, transaction] of eftTransactions.entries()) {
      if (transaction.segments.length === 0) {
        throw new Error(`Transaction ${String(transactionIndex)} has no segments.`);
      }
      if (transaction.segments.length > EFTFileSpec.MAX_SEGMENTS_PER_RECORD) {
        throw new Error(
          `Transaction ${String(transactionIndex)} has more than ${String(EFTFileSpec.MAX_SEGMENTS_PER_RECORD)} segments; split into multiple transactions.`
        );
      }

      if (!Object.values(TRANSACTION_TYPE).includes(transaction.recordType)) {
        throw new Error(`Unsupported recordType: ${transaction.recordType}`);
      }

      for (const [segmentIndex, segment] of transaction.segments.entries()) {
        if (segment.amount <= 0) {
          throw new Error(
            `Segment ${String(segmentIndex)} amount must be positive: ${String(segment.amount)}`
          );
        }
        if (segment.amount >= EFTFileSpec.MAX_TRANSACTION_AMOUNT) {
          throw new Error(
            `Segment ${String(segmentIndex)} amount exceeds ${String(EFTFileSpec.MAX_TRANSACTION_AMOUNT)}: ${String(segment.amount)}`
          );
        }

        if (segment.payeeName.length > EFTFileSpec.FIELD_WIDTHS.payeeName) {
          throw new Error(
            `payeeName exceeds ${String(EFTFileSpec.FIELD_WIDTHS.payeeName)} characters: ${segment.payeeName}`
          );
        }
        if (containsProhibitedCharacters(segment.payeeName)) {
          throw new Error(
            `payeeName contains prohibited characters: ${segment.payeeName}`
          );
        }

        if (segment.crossReferenceNumber !== undefined) {
          if (
            segment.crossReferenceNumber.length > EFTFileSpec.FIELD_WIDTHS.crossReference
          ) {
            throw new Error(
              `crossReferenceNumber exceeds ${String(EFTFileSpec.FIELD_WIDTHS.crossReference)} characters: ${segment.crossReferenceNumber}`
            );
          }
          if (containsProhibitedCharacters(segment.crossReferenceNumber)) {
            throw new Error(
              `crossReferenceNumber contains prohibited characters: ${segment.crossReferenceNumber}`
            );
          }
          if (crossReferenceNumbers.has(segment.crossReferenceNumber)) {
            throw new Error(
              `crossReferenceNumber must be unique within a file: ${segment.crossReferenceNumber}`
            );
          }
          crossReferenceNumbers.add(segment.crossReferenceNumber);
        }

        if (segment.paymentDate !== undefined) {
          const offsetMs = segment.paymentDate.getTime() - fileCreationDate.getTime();
          if (Math.abs(offsetMs) > MAX_PAYMENT_DATE_OFFSET_MS) {
            throw new Error(
              `Segment ${String(segmentIndex)} paymentDate is more than ${String(MAX_PAYMENT_DATE_OFFSET_DAYS)} days from fileCreationDate: ${segment.paymentDate.toISOString()}`
            );
          }
        }
      }
    }
  }
}
