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

type HeaderFieldValues = ReturnType<Header['getFieldValues']>;
type TransactionFieldValues = ReturnType<Transaction['getFieldValues']>;
type TrailerFieldValues = ReturnType<Trailer['getFieldValues']>;

export interface EFTGenerateResult {
  output: string;
  lines: Array<HeaderFieldValues | TransactionFieldValues | TrailerFieldValues>;
}

export class EFTFileBuilder {
  readonly #config: EFTConfiguration;
  readonly #transactions: Array<EFTTransaction>;
  #lines: Array<Header | Transaction | Trailer>;
  readonly #validator: EFTFileValidator;

  constructor(config: EFTConfiguration) {
    this.#config = config;
    this.#transactions = [];
    this.#lines = [];
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

  getTransactions(): Array<EFTTransaction> {
    return this.#transactions;
  }

  /**
   * Generates a CPA-005 formatted string and a per-record breakdown of
   * each field's pre-format (`before`) and on-the-wire (`after`) value.
   * `lines` is ordered: header, one entry per transaction (a flat list of
   * its segments' field values), then the trailer.
   *
   * @throws Fatal error if the configuration or transactions don't pass validation.
   */
  generate(): EFTGenerateResult {
    this.#validator.validate();

    const header = new Header(this);
    this.#lines.push(header);
    const transactions: Array<Transaction> = [];
    for (const [index, tx] of this.#transactions.entries()) {
      const recordNumber = index + 2; // header is record 1
      const transaction = new Transaction(this, tx, recordNumber);
      transactions.push(transaction);
      this.#lines.push(transaction);
    }
    const trailer = new Trailer(this);
    this.#lines.push(trailer);

    const output = this.#lines.map((line) => line.print()).join(NEWLINE);
    this.#validator.validateFile(output);

    const lines: EFTGenerateResult['lines'] = [
      header.getFieldValues(),
      ...transactions.map((t) => t.getFieldValues()),
      trailer.getFieldValues()
    ];

    return { output, lines };
  }

  /**
   * Validates the configuration and transactions against the CPA-005 spec.
   * Re-throws any error the validator surfaces.
   */
  validate(): void {
    this.#validator.validate();
  }

  getLines() {
    return this.#lines;
  }
}
