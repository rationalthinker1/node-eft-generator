export const NEWLINE = '\r';

interface FixedFieldOpts {
  align: 'left' | 'right';
  pad: ' ' | '0';
}

const MILLISECONDS_PER_DAY = 86_400_000;

// Input characters allowed before uppercasing. Lowercase ASCII letters are
// permitted because sanitizeCPA005Text() will uppercase them; they are not
// truly prohibited. Characters outside this set must be rejected by the
// validator before generation.
const PROHIBITED_INPUT_CHARACTERS = /[^A-Za-z0-9 =_$.&*,]/;

// Characters allowed in the on-the-wire (post-uppercase) record. Anything
// outside this set is replaced with a space by sanitizeCPA005Text().
const PROHIBITED_OUTPUT_CHARACTERS_GLOBAL = /[^A-Z0-9 =_$.&*,]/g;

export function containsProhibitedCharacters(input: string): boolean {
  return PROHIBITED_INPUT_CHARACTERS.test(input);
}

export function sanitizeCPA005Text(input: string): string {
  return input.toUpperCase().replaceAll(PROHIBITED_OUTPUT_CHARACTERS_GLOBAL, ' ');
}

/**
 * Pad a value to a fixed width. Throws if the value already exceeds the
 * width so calculation bugs surface at the offending field instead of
 * silently truncating or producing an oversized record.
 */
export function fixedField(
  value: string,
  width: number,
  opts: FixedFieldOpts
): string {
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
 * Assert a fully-assembled logical record is exactly the expected length.
 * Returns the record unchanged for chaining.
 */
export function assertRecordLength(
  record: string,
  kind: string,
  expectedLength: number
): string {
  if (record.length !== expectedLength) {
    throw new Error(
      `CPA-005 ${kind} record length is ${String(record.length)}, expected ${String(expectedLength)}`
    );
  }
  return record;
}

/**
 * Returns a CPA-005 formatted date: 6 characters as `0YYDDD` where
 * YY is the 2-digit year and DDD is the 3-digit day-of-year (1-366).
 */
export function toPaddedJulianDate(date: Date): `0${string}` {
  const year = date.getFullYear();
  const startOfYearUTC = Date.UTC(year, 0, 1);
  const dateUTC = Date.UTC(year, date.getMonth(), date.getDate());
  const dayOfYear = Math.floor((dateUTC - startOfYearUTC) / MILLISECONDS_PER_DAY) + 1;

  const yy = (year % 100).toString().padStart(2, '0');
  const ddd = dayOfYear.toString().padStart(3, '0');

  return `0${yy}${ddd}`;
}
