export const NEWLINE = '\r';

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
