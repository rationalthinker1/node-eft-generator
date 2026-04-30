import { EFTFileValidator } from '#EFTFileValidator';
import {
  TRANSACTION_TYPE,
  type EFTConfiguration,
  type EFTTransaction,
  type EFTTransactionSegment
} from '#types';
import { Header } from '#records/Header';
import { Trailer } from '#records/Trailer';
import { Transaction } from '#records/Transaction';
import { NEWLINE } from '#utils/index';

export class EFTFileBuilder {
  readonly #config: EFTConfiguration;
  readonly #transactions: EFTTransaction[];
  readonly #validator: EFTFileValidator;

  constructor(config: EFTConfiguration) {
    this.#config = config;
    this.#transactions = [];
    this.#validator = new EFTFileValidator(this);
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
    this.#validator.validate();

    const lines: string[] = [];
    lines.push(new Header(this).print());
    for (const [index, tx] of this.#transactions.entries()) {
      const recordNumber = index + 2; // header is record 1
      lines.push(new Transaction(this, tx, recordNumber).print());
    }
    lines.push(new Trailer(this).print());

    const output = lines.join(NEWLINE);
    this.#validator.validateFile(output);
    return output;
  }

  /**
   * Validates the configuration and transactions against the CPA-005 spec.
   * Re-throws any error the validator surfaces.
   */
  validate(): void {
    this.#validator.validate();
  }
}
