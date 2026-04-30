import type { EFTFileBuilder } from '#EFTFileBuilder';
import { Header } from '#records/Header';
import { MAX_FILE_TRANSACTION_COUNT, RECORD_LENGTH } from '#domain/spec';
import { Trailer } from '#records/Trailer';
import { Transaction } from '#records/Transaction';
import { RECORD_TYPE } from '#domain/types';
import { NEWLINE } from '#utils/index';

const PROHIBITED_OUTPUT_CHAR_PATTERN = /[^0-9A-Z =_$.&*,]/;

// Trailer field 02 is at positions 2-10 (1-indexed), 9 chars wide,
// containing the file's total logical record count zero-padded.
const TRAILER_RECORD_COUNT_START = 1;
const TRAILER_RECORD_COUNT_END = 10;

// Minimum valid file: header + 1 transaction + trailer.
const MINIMUM_RECORD_COUNT = 3;

/**
 * Orchestrates the per-record `Validable.validate()` calls and adds the
 * file-level cross-cutting checks no individual record can see —
 * transaction count limits, crossReferenceNumber uniqueness across all
 * segments, and the post-generation `validateFile()` audit on the
 * fully-assembled output.
 *
 * Per-record invariants live on the records themselves:
 *  - {@link Header.validate}: every {@link EFTConfiguration} field
 *  - {@link Transaction.validate}: recordType + segment count, recurses
 *  - {@link Segment.validate}: amount, payeeName length, paymentDate
 *    offset, crossReferenceNumber length and characters
 *  - {@link Trailer.validate}: trivial (totals are derived)
 *
 * Prohibited characters in `payeeName` are accepted and sanitized at
 * write time (third-party data routinely contains hyphens like
 * 'GOLDSTEIN-KRUPSKI' and apostrophes like O'BRIEN). The corresponding
 * `console.warn` is emitted by `Segment.log` so it stays next to the
 * transaction it describes.
 *
 * The validator is run automatically by `EFTFileGenerator.generate()`,
 * so any throw aborts file generation before any record is emitted.
 */
export class EFTFileValidator {
  readonly #builder: EFTFileBuilder;

  constructor(builder: EFTFileBuilder) {
    this.#builder = builder;
  }

  validate(): void {
    // Records auto-log only when their print() is called, so constructing
    // them here for validation does not produce any console output.
    //
    // Header first: config errors should surface before transaction-shape
    // errors, matching the pre-refactor ordering.
    new Header(this.#builder).validate();

    this.#validateTransactionCount();

    for (const [index, tx] of this.#builder.getTransactions().entries()) {
      const recordNumber = index + 2; // header is record 1
      new Transaction(this.#builder, tx, recordNumber).validate();
    }

    this.#validateCrossReferenceUniqueness();

    new Trailer(this.#builder).validate();
  }

  /**
   * End-of-pipeline audit on the fully-assembled file.
   *
   * `validate()` catches bad input and `assertRecordLength` catches
   * malformed individual records. This method is the last line of
   * defence: it verifies file-level invariants no per-record check can
   * see (record ordering, exactly-one header/trailer, trailer
   * reconciliation, no stray prohibited characters anywhere in the
   * assembled output).
   *
   * Throws on the first violation found.
   */
  validateFile(output: string): void {
    if (output.length === 0) {
      throw new Error('CPA-005 output is empty.');
    }

    if (output.includes('\n')) {
      throw new Error(
        'CPA-005 output contains LF (0x0A); records must be CR-only delimited (spec page 58).'
      );
    }

    const lines = output.split(NEWLINE);

    if (lines.length < MINIMUM_RECORD_COUNT) {
      throw new Error(
        `CPA-005 output has ${String(lines.length)} record(s); a valid file requires at least ${String(MINIMUM_RECORD_COUNT)} (header, transaction, trailer).`
      );
    }

    for (const [index, line] of lines.entries()) {
      const recordNumber = index + 1;

      if (line.length !== RECORD_LENGTH) {
        throw new Error(
          `CPA-005 record ${String(recordNumber)} length is ${String(line.length)}, expected ${String(RECORD_LENGTH)}.`
        );
      }

      const offending = PROHIBITED_OUTPUT_CHAR_PATTERN.exec(line);
      if (offending) {
        throw new Error(
          `CPA-005 record ${String(recordNumber)} contains prohibited character ${JSON.stringify(offending[0])} at column ${String(offending.index + 1)}.`
        );
      }
    }

    if (!lines[0]?.startsWith(RECORD_TYPE.HEADER)) {
      throw new Error(
        `CPA-005 first record must start with '${RECORD_TYPE.HEADER}' (header), got '${String(lines[0]?.charAt(0))}'.`
      );
    }

    const trailerLine = lines.at(-1);
    if (!trailerLine?.startsWith(RECORD_TYPE.TRAILER)) {
      throw new Error(
        `CPA-005 last record must start with '${RECORD_TYPE.TRAILER}' (trailer), got '${String(trailerLine?.charAt(0))}'.`
      );
    }

    let headerCount = 0;
    let trailerCount = 0;
    for (const [index, line] of lines.entries()) {
      const recordType = line.charAt(0);

      if (recordType === RECORD_TYPE.HEADER) {
        headerCount += 1;
      } else if (recordType === RECORD_TYPE.TRAILER) {
        trailerCount += 1;
      } else if (
        recordType !== RECORD_TYPE.TRANSACTION_CREDIT &&
        recordType !== RECORD_TYPE.TRANSACTION_DEBIT
      ) {
        throw new Error(
          `CPA-005 record ${String(index + 1)} has unknown record type '${recordType}'; expected one of '${RECORD_TYPE.HEADER}', '${RECORD_TYPE.TRANSACTION_CREDIT}', '${RECORD_TYPE.TRANSACTION_DEBIT}', '${RECORD_TYPE.TRAILER}'.`
        );
      }
    }

    if (headerCount !== 1) {
      throw new Error(
        `CPA-005 must contain exactly 1 header record; found ${String(headerCount)}.`
      );
    }
    if (trailerCount !== 1) {
      throw new Error(
        `CPA-005 must contain exactly 1 trailer record; found ${String(trailerCount)}.`
      );
    }

    const trailerRecordCountField = trailerLine.slice(
      TRAILER_RECORD_COUNT_START,
      TRAILER_RECORD_COUNT_END
    );
    const trailerRecordCount = Number.parseInt(trailerRecordCountField, 10);
    if (Number.isNaN(trailerRecordCount) || trailerRecordCount !== lines.length) {
      throw new Error(
        `CPA-005 trailer record count is "${trailerRecordCountField}", expected ${String(lines.length)} (matching actual line count).`
      );
    }
  }

  #validateTransactionCount(): void {
    const transactions = this.#builder.getTransactions();
    if (transactions.length === 0) {
      throw new Error('There are no transactions in this file.');
    }
    if (transactions.length > MAX_FILE_TRANSACTION_COUNT) {
      throw new Error(`Transaction count exceeds ${String(MAX_FILE_TRANSACTION_COUNT)}.`);
    }
  }

  #validateCrossReferenceUniqueness(): void {
    const seen = new Set<string>();
    for (const tx of this.#builder.getTransactions()) {
      for (const seg of tx.segments) {
        if (seg.crossReferenceNumber === undefined) continue;
        if (seen.has(seg.crossReferenceNumber)) {
          throw new Error(
            `crossReferenceNumber must be unique within a file: ${seg.crossReferenceNumber}`
          );
        }
        seen.add(seg.crossReferenceNumber);
      }
    }
  }
}
