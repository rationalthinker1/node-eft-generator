/**
 * Branded string types for the digit fields the CPA-005 spec requires.
 *
 * Each branded type can only be produced through its constructor, which
 * validates the digit pattern at runtime. This means downstream code can
 * treat the value as already-validated and skip its own length / shape
 * checks.
 */

declare const __digitsBrand: unique symbol;

type Branded<TBrand extends string> = string & {
  readonly [__digitsBrand]: TBrand;
};

export type Institution3 = Branded<'Institution3'>;
export type Transit5 = Branded<'Transit5'>;
export type Account5to12 = Branded<'Account5to12'>;

const INSTITUTION_PATTERN = /^\d{3}$/;
const TRANSIT_PATTERN = /^\d{5}$/;
const ACCOUNT_PATTERN = /^\d{5,12}$/;

/**
 * 3-digit financial institution number (e.g. "003" RBC, "001" BMO,
 * "010" CIBC, "004" TD, plus credit unions and others that may not
 * begin with a leading zero).
 */
export function institution3(value: string): Institution3 {
  if (!INSTITUTION_PATTERN.test(value)) {
    throw new Error(`bankInstitutionNumber must be exactly 3 digits: "${value}"`);
  }
  return value as Institution3;
}

/**
 * 5-digit branch / transit number.
 */
export function transit5(value: string): Transit5 {
  if (!TRANSIT_PATTERN.test(value)) {
    throw new Error(`bankTransitNumber must be exactly 5 digits: "${value}"`);
  }
  return value as Transit5;
}

/**
 * 5-12 digit account number.
 */
export function account5to12(value: string): Account5to12 {
  if (!ACCOUNT_PATTERN.test(value)) {
    throw new Error(`bankAccountNumber must be 5 to 12 digits: "${value}"`);
  }
  return value as Account5to12;
}
