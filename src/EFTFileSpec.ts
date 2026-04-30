/**
 * Constants and assertions derived from the CPA-005 standard.
 *
 * References:
 * - Canadian Payments Association Standard 005
 * - docs/rbc-cpa-005-reference.pdf
 * - docs/bmo-cpa-005-reference.pdf
 */

interface FixedFieldOpts {
  align: 'left' | 'right';
  pad: ' ' | '0';
}

export class EFTFileSpec {
  static readonly RECORD_LENGTH = 1464;
  static readonly MAX_SEGMENTS_PER_RECORD = 6;
  static readonly MAX_TRANSACTION_AMOUNT = 100_000_000;
  static readonly MAX_FILE_TRANSACTION_COUNT = 999_999_999;

  /**
   * Maximum widths for the alphanumeric fields the validator length-checks.
   * The generator no longer reads from this — field widths are derived
   * from each field's `start`/`end` positions in `EFTFileGenerator`.
   */
  static readonly FIELD_WIDTHS = {
    originatorId: 10,
    originatorShortName: 15,
    originatorLongName: 30,
    payeeName: 30,
    crossReference: 19
  } as const;

  /**
   * Pad a value to a fixed width. Throws if the value already exceeds the
   * width so calculation bugs surface at the offending field instead of
   * silently truncating or producing an oversized record.
   */
  static fixedField(value: string, width: number, opts: FixedFieldOpts): string {
    if (value.length > width) {
      throw new Error(
        `CPA-005 field overflow: value of length ${String(value.length)} exceeds width ${String(width)} (value: "${value}")`
      );
    }
    return opts.align === 'left'
      ? value.padEnd(width, opts.pad)
      : value.padStart(width, opts.pad);
  }

  /**
   * Assert a fully-assembled logical record is exactly RECORD_LENGTH bytes.
   * Returns the record unchanged for chaining.
   */
  static assertRecordLength(record: string, kind: string): string {
    if (record.length !== EFTFileSpec.RECORD_LENGTH) {
      throw new Error(
        `CPA-005 ${kind} record length is ${String(record.length)}, expected ${String(EFTFileSpec.RECORD_LENGTH)}`
      );
    }
    return record;
  }

}
