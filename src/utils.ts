export const NEWLINE = '\r';

const MILLISECONDS_PER_DAY = 86_400_000;

const PROHIBITED_CHARACTERS = /[^A-Z0-9 =_$.&*,]/;
const PROHIBITED_CHARACTERS_GLOBAL = new RegExp(PROHIBITED_CHARACTERS.source, 'g');

export function containsProhibitedCharacters(input: string): boolean {
  return PROHIBITED_CHARACTERS.test(input);
}

export function sanitizeCPA005Text(input: string): string {
  return input.toUpperCase().replaceAll(PROHIBITED_CHARACTERS_GLOBAL, ' ');
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
