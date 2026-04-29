import type { EFTFileBuilder } from '#EFTFileBuilder';
import {
  TRANSACTION_TYPE,
  type EFTConfiguration,
  type EFTTransaction,
  type ValidationWarning
} from '#types';
import { containsProhibitedCharacters } from '#utils';

export class EFTFileValidator {
  readonly #builder: EFTFileBuilder;

  constructor(builder: EFTFileBuilder) {
    this.#builder = builder;
  }

  validate(): ValidationWarning[] {
    return [
      ...this.validateConfig(this.#builder.getConfiguration()),
      ...this.validateTransactions(this.#builder.getTransactions())
    ];
  }

  validateConfig(eftConfig: EFTConfiguration): ValidationWarning[] {
    const validationWarnings: ValidationWarning[] = [];

    if (eftConfig.originatorId.length > 10) {
      throw new Error(`originatorId length exceeds 10: ${eftConfig.originatorId}`);
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
      validationWarnings.push({
        warningField: 'originatorShortName',
        warning: 'originatorShortName not defined, using originatorLongName.'
      });

      eftConfig.originatorShortName = eftConfig.originatorLongName;
    }

    if (eftConfig.originatorShortName.length > 15) {
      validationWarnings.push({
        warning: `originatorShortName will be truncated to 15 characters: ${eftConfig.originatorShortName}`,
        warningField: 'originatorShortName'
      });
    }

    if (containsProhibitedCharacters(eftConfig.originatorShortName)) {
      validationWarnings.push({
        warning: `originatorShortName contains prohibited characters and will be sanitized: ${eftConfig.originatorShortName}`,
        warningField: 'originatorShortName'
      });
    }

    if (eftConfig.originatorLongName.length > 30) {
      validationWarnings.push({
        warning: `originatorLongName will be truncated to 30 characters: ${eftConfig.originatorLongName}`,
        warningField: 'originatorLongName'
      });
    }

    if (containsProhibitedCharacters(eftConfig.originatorLongName)) {
      validationWarnings.push({
        warning: `originatorLongName contains prohibited characters and will be sanitized: ${eftConfig.originatorLongName}`,
        warningField: 'originatorLongName'
      });
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

    return validationWarnings;
  }

  validateTransactions(eftTransactions: EFTTransaction[]): ValidationWarning[] {
    const validationWarnings: ValidationWarning[] = [];

    if (eftTransactions.length === 0) {
      validationWarnings.push({
        warning: 'There are no transactions to include in the file.',
        warningField: 'transactions'
      });
    } else if (eftTransactions.length > 999_999_999) {
      throw new Error('Transaction count exceeds 999,999,999.');
    }

    const crossReferenceNumbers = new Set<string>();

    for (const [transactionIndex, transaction] of eftTransactions.entries()) {
      if (transaction.segments.length === 0) {
        validationWarnings.push({
          transactionIndex,
          warning: 'Transaction record has no segments, will be ignored.',
          warningField: 'segments'
        });
      } else if (transaction.segments.length > 6) {
        validationWarnings.push({
          transactionIndex,
          warning:
            'Transaction record has more than 6 segments, will be split into multiple transactions.',
          warningField: 'segments'
        });
      }

      if (!Object.values(TRANSACTION_TYPE).includes(transaction.recordType)) {
        throw new Error(`Unsupported recordType: ${transaction.recordType}`);
      }

      for (const [transactionSegmentIndex, segment] of transaction.segments.entries()) {
        // cpaCode is typed as CPATransactionCode (the literal union of known
        // codes), so unknown codes are rejected at compile time.

        if (segment.amount <= 0) {
          throw new Error(
            `Segment amount cannot be less than or equal to zero: ${String(segment.amount)}`
          );
        }

        if (segment.amount >= 100_000_000) {
          throw new Error(
            `Segment amount cannot exceed $100,000,000: ${String(segment.amount)}`
          );
        }

        // bankInstitutionNumber, bankTransitNumber and bankAccountNumber are
        // already validated at construction time by their branded constructors
        // (bankInstitution / bankTransit / bankAccount).

        if (segment.payeeName.length > 30) {
          validationWarnings.push({
            transactionIndex,
            transactionSegmentIndex,
            warning: `payeeName will be truncated to 30 characters: ${segment.payeeName}`,
            warningField: 'payeeName'
          });
        }

        if (segment.crossReferenceNumber !== undefined) {
          if (crossReferenceNumbers.has(segment.crossReferenceNumber)) {
            validationWarnings.push({
              transactionIndex,
              transactionSegmentIndex,
              warning: `crossReferenceNumber should be unique: ${segment.crossReferenceNumber}`,
              warningField: 'crossReferenceNumber'
            });
          }
          crossReferenceNumbers.add(segment.crossReferenceNumber);
        }
      }
    }

    return validationWarnings;
  }
}
