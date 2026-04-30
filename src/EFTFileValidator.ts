import type { EFTFileBuilder } from '#EFTFileBuilder';
import {
  RECORD_TYPE,
  TRANSACTION_TYPE,
  type EFTConfiguration,
  type EFTTransaction
} from '#types';
import { NEWLINE, containsProhibitedCharacters } from '#utils';

export const RECORD_LENGTH = 1464;
export const MAX_SEGMENTS_PER_RECORD = 6;
export const MAX_TRANSACTION_AMOUNT = 100_000_000;
export const MAX_FILE_TRANSACTION_COUNT = 999_999_999;
export const FIELD_WIDTHS = {
  originatorId: 10,
  originatorShortName: 15,
  originatorLongName: 30,
  payeeName: 30,
  crossReference: 19
} as const;

const MS_PER_DAY = 86_400_000;
const MAX_PAYMENT_DATE_OFFSET_DAYS = 173;
const MAX_PAYMENT_DATE_OFFSET_MS = MAX_PAYMENT_DATE_OFFSET_DAYS * MS_PER_DAY;

const PROHIBITED_OUTPUT_CHAR_PATTERN = /[^0-9A-Z =_$.&*,]/;

// Trailer field 02 is at positions 2-10 (1-indexed), 9 chars wide,
// containing the file's total logical record count zero-padded.
const TRAILER_RECORD_COUNT_START = 1;
const TRAILER_RECORD_COUNT_END = 10;

// Minimum valid file: header + 1 transaction + trailer.
const MINIMUM_RECORD_COUNT = 3;

/**
 * Validates an `EFTFileBuilder` against the CPA-005 specification.
 *
 * Throws on every spec violation, with one exception: prohibited
 * characters in `payeeName` are accepted and sanitized at write time
 * (third-party data routinely contains hyphens like 'GOLDSTEIN-KRUPSKI'
 * and apostrophes like O'BRIEN). The corresponding `console.warn` is
 * emitted by `EFTFileGenerator.#logSegment` so it appears next to the
 * transaction it describes, not in a batch at the top of the run.
 *
 * All other fields (originatorId, the originator names, and
 * crossReferenceNumber) still throw — they are caller-controlled and
 * bad input there is a configuration bug.
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
    this.validateConfig(this.#builder.getConfiguration());
    this.validateTransactions(this.#builder.getTransactions());
  }

  /**
   * Comprehensive end-of-pipeline check on the fully-assembled file.
   *
   * `validate()` catches bad input and `assertRecordLength`
   * catches malformed individual records. This method is the last line of
   * defence: it verifies file-level invariants no per-record check can see
   * (record ordering, exactly-one header/trailer, trailer reconciliation,
   * no stray prohibited characters anywhere in the assembled output).
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

  validateConfig(eftConfig: EFTConfiguration): void {
    if (eftConfig.originatorId.length > FIELD_WIDTHS.originatorId) {
      throw new Error(
        `originatorId length exceeds ${String(FIELD_WIDTHS.originatorId)}: ${eftConfig.originatorId}`
      );
    }

    if (containsProhibitedCharacters(eftConfig.originatorId)) {
      throw new Error(
        `originatorId contains prohibited characters: ${eftConfig.originatorId}`
      );
    }

    if (!/^\d{1,4}$/.test(eftConfig.fileCreationNumber)) {
      throw new Error(
        `fileCreationNumber should be 1 to 4 digits: ${eftConfig.fileCreationNumber}`
      );
    }

    if (!/^\d{1,5}$/.test(eftConfig.destinationDataCentre)) {
      throw new Error(
        `destinationDataCentre should be 1 to 5 digits: ${eftConfig.destinationDataCentre}`
      );
    }

    if (
      eftConfig.originatorShortName.length > FIELD_WIDTHS.originatorShortName
    ) {
      throw new Error(
        `originatorShortName exceeds ${String(FIELD_WIDTHS.originatorShortName)} characters: ${eftConfig.originatorShortName}`
      );
    }

    if (containsProhibitedCharacters(eftConfig.originatorShortName)) {
      throw new Error(
        `originatorShortName contains prohibited characters: ${eftConfig.originatorShortName}`
      );
    }

    if (
      eftConfig.originatorLongName.length > FIELD_WIDTHS.originatorLongName
    ) {
      throw new Error(
        `originatorLongName exceeds ${String(FIELD_WIDTHS.originatorLongName)} characters: ${eftConfig.originatorLongName}`
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
    if (eftTransactions.length > MAX_FILE_TRANSACTION_COUNT) {
      throw new Error(
        `Transaction count exceeds ${String(MAX_FILE_TRANSACTION_COUNT)}.`
      );
    }

    const fileCreationDate =
      this.#builder.getConfiguration().fileCreationDate ?? new Date();

    const crossReferenceNumbers = new Set<string>();

    for (const [transactionIndex, transaction] of eftTransactions.entries()) {
      if (transaction.segments.length === 0) {
        throw new Error(`Transaction ${String(transactionIndex)} has no segments.`);
      }
      if (transaction.segments.length > MAX_SEGMENTS_PER_RECORD) {
        throw new Error(
          `Transaction ${String(transactionIndex)} has more than ${String(MAX_SEGMENTS_PER_RECORD)} segments; split into multiple transactions.`
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
        if (segment.amount >= MAX_TRANSACTION_AMOUNT) {
          throw new Error(
            `Segment ${String(segmentIndex)} amount exceeds ${String(MAX_TRANSACTION_AMOUNT)}: ${String(segment.amount)}`
          );
        }

        if (segment.payeeName.length > FIELD_WIDTHS.payeeName) {
          throw new Error(
            `payeeName exceeds ${String(FIELD_WIDTHS.payeeName)} characters: ${segment.payeeName}`
          );
        }
        // Note: prohibited characters in payeeName are intentionally
        // tolerated; the warning is emitted by the generator inline with
        // the transaction log so it stays next to the segment it refers to.

        if (segment.crossReferenceNumber !== undefined) {
          if (
            segment.crossReferenceNumber.length > FIELD_WIDTHS.crossReference
          ) {
            throw new Error(
              `crossReferenceNumber exceeds ${String(FIELD_WIDTHS.crossReference)} characters: ${segment.crossReferenceNumber}`
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
