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

const TRANSIT_PATTERN = /^\d{5}$/;
const ACCOUNT_PATTERN = /^\d{5,12}$/;

/**
 * Recognised Canadian 3-digit financial institution numbers, as published
 * by Payments Canada. Update this set when onboarding a new FI.
 */
const VALID_INSTITUTIONS: ReadonlySet<string> = new Set([
  '001', // BMO
  '002', // Scotia
  '003', // RBC
  '004', // TD
  '006', // National Bank
  '010', // CIBC
  '016', // HSBC
  '030', // Canadian Western
  '039', // Laurentian
  '177', // Bank of Canada
  '219', // ATB Financial
  '260', // Citibank Canada
  '326', // PC Financial
  '338', // Canadian Tire Bank
  '340', // ICICI
  '352', // Manulife Bank
  '540', // Manulife Bank
  '614', // ICICI
  '809', // Central 1 (BC/ON)
  '815', // Caisse Pop. (Desjardins)
  '828', // Central 1 - ON CUs
  '829', // Desjardins
  '837', // Meridian / OEECU
  '839', // Heritage CU
  '849', // Caisses populaires acadiennes
  '879' // Various credit unions
]);

/**
 * 3-digit financial institution number, validated against the
 * known-good Canadian FI list (e.g. "003" RBC, "001" BMO, "010" CIBC,
 * "004" TD).
 */
export function bankInstitution(value: string): BankInstitution {
  if (!VALID_INSTITUTIONS.has(value)) {
    throw new Error(`bankInstitutionNumber is not a recognised Canadian FI: "${value}"`);
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
