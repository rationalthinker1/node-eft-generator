/**
 * Branded string types for the digit fields a CPA-005 Pre-Authorized
 * Debit (PAD) record requires: the routing trio (institution, transit,
 * account number).
 *
 * Each branded type can only be produced through its constructor, which
 * validates the digit pattern at runtime. Downstream code can treat the
 * value as already-validated and skip its own length / shape checks.
 */

declare const __bankPADBrand: unique symbol;

type BankPADInformation<TBrand extends string> = string & {
  readonly [__bankPADBrand]: TBrand;
};

export type BankInstitution = BankPADInformation<'BankInstitution'>;
export type BankTransit = BankPADInformation<'BankTransit'>;
export type BankAccount = BankPADInformation<'BankAccount'>;

const INSTITUTION_PATTERN = /^\d{3}$/;
const TRANSIT_PATTERN = /^\d{5}$/;
const ACCOUNT_PATTERN = /^\d{5,12}$/;

/**
 * 3-digit financial institution number (e.g. "003" RBC, "001" BMO,
 * "010" CIBC, "004" TD, plus credit unions and others that may not
 * begin with a leading zero).
 */
export function bankInstitution(value: string): BankInstitution {
  if (!INSTITUTION_PATTERN.test(value)) {
    throw new Error(`bankInstitutionNumber must be exactly 3 digits: "${value}"`);
  }
  return value as BankInstitution;
}

/**
 * 5-digit branch / transit number.
 */
export function bankTransit(value: string): BankTransit {
  if (!TRANSIT_PATTERN.test(value)) {
    throw new Error(`bankTransitNumber must be exactly 5 digits: "${value}"`);
  }
  return value as BankTransit;
}

/**
 * 5-12 digit account number.
 */
export function bankAccount(value: string): BankAccount {
  if (!ACCOUNT_PATTERN.test(value)) {
    throw new Error(`bankAccountNumber must be 5 to 12 digits: "${value}"`);
  }
  return value as BankAccount;
}
