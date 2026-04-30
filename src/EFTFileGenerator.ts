import 'reflect-metadata';

import type { EFTFileBuilder } from '#EFTFileBuilder';
import { EFTFileValidator } from '#EFTFileValidator';
import { Header } from '#records/Header';
import { Trailer } from '#records/Trailer';
import { Transaction } from '#records/Transaction';
import { NEWLINE } from '#utils/index';

/**
 * Orchestrates the four record kinds (Header, Transaction, Segment,
 * Trailer) into a CPA-005 file. Each record is constructed with just the
 * builder (plus a record number where needed) and pulls everything else
 * it needs from `builder.getConfiguration()` / `builder.getTransactions()`.
 */
export class EFTFileGenerator {
  readonly #builder: EFTFileBuilder;
  readonly #validator: EFTFileValidator;

  constructor(builder: EFTFileBuilder) {
    this.#builder = builder;
    this.#validator = new EFTFileValidator(builder);
  }

  generate(): string {
    this.#validator.validate();

    // Header / Transaction / Trailer constructors auto-log when invoked.
    const lines: string[] = [];
    lines.push(new Header(this.#builder).print());
    for (const [index, tx] of this.#builder.getTransactions().entries()) {
      const recordNumber = index + 2; // header is record 1
      lines.push(new Transaction(this.#builder, tx, recordNumber).print());
    }
    lines.push(new Trailer(this.#builder).print());

    const output = lines.join(NEWLINE);
    this.#validator.validateFile(output);
    return output;
  }
}
