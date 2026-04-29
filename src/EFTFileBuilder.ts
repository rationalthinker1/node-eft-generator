import { EFTFileValidator } from '#EFTFileValidator';
import { EFTFileGenerator } from '#EFTFileGenerator';
import {
  TRANSACTION_TYPE,
  type EFTConfiguration,
  type EFTTransaction,
  type EFTTransactionSegment
} from '#types';

export class EFTFileBuilder {
  readonly #config: EFTConfiguration;
  readonly #transactions: EFTTransaction[];
  readonly #validator: EFTFileValidator;
  readonly #generator: EFTFileGenerator;

  constructor(config: EFTConfiguration) {
    this.#config = config;
    this.#transactions = [];
    this.#validator = new EFTFileValidator(this);
    this.#generator = new EFTFileGenerator(this);
  }

  getConfiguration(): EFTConfiguration {
    return this.#config;
  }

  addTransaction(transaction: EFTTransaction): void {
    this.#transactions.push(transaction);
  }

  addCreditTransaction(transactionSegment: EFTTransactionSegment): void {
    this.addTransaction({
      recordType: TRANSACTION_TYPE.CREDIT,
      segments: [transactionSegment]
    });
  }

  addDebitTransaction(transactionSegment: EFTTransactionSegment): void {
    this.addTransaction({
      recordType: TRANSACTION_TYPE.DEBIT,
      segments: [transactionSegment]
    });
  }

  getTransactions(): EFTTransaction[] {
    return this.#transactions;
  }

  /**
   * Generates a CPA-005 formatted string.
   * @throws Fatal error if the configuration or transactions don't pass validation.
   * @returns Data formatted to the CPA-005 standard.
   */
  generate(): string {
    return this.#generator.generate();
  }

  /**
   * Validates the configuration and transactions against the CPA-005 spec.
   * Re-throws any error the validator surfaces.
   */
  validate(): void {
    this.#validator.validate();
  }
}
