/**
 * Branded string types and constructors for the digit fields a CPA-005
 * Pre-Authorized Debit (PAD) record requires: the routing trio of
 * institution, transit, and account number.
 *
 * Each branded type can only be produced through the corresponding
 * static method on `BankPADInformation`, which validates the digit
 * pattern at runtime. Downstream code can treat the value as
 * already-validated and skip its own length / shape checks.
 */

declare const __bankPADBrand: unique symbol;

type BankPADBrand<TBrand extends string> = string & {
  readonly [__bankPADBrand]: TBrand;
};

export type BankInstitution = BankPADBrand<'BankInstitution'>;
export type BankTransit = BankPADBrand<'BankTransit'>;
export type BankAccount = BankPADBrand<'BankAccount'>;

const TRANSIT_PATTERN = /^\d{5}$/;
const ACCOUNT_PATTERN = /^\d{5,12}$/;

/**
 * Recognised Canadian 3-digit financial institution numbers, as
 * published by Payments Canada. Add to this map when onboarding a new FI.
 */
export const BankInstitution = Object.freeze({
  BMO: '001' as BankInstitution,
  Scotia: '002' as BankInstitution,
  RBC: '003' as BankInstitution,
  TD: '004' as BankInstitution,
  NationalBank: '006' as BankInstitution,
  CIBC: '010' as BankInstitution,
  HSBC: '016' as BankInstitution,
  CanadianWestern: '030' as BankInstitution,
  Laurentian: '039' as BankInstitution,
  BankOfCanada: '177' as BankInstitution,
  ATBFinancial: '219' as BankInstitution,
  CitibankCanada: '260' as BankInstitution,
  PCFinancial: '326' as BankInstitution,
  CanadianTireBank: '338' as BankInstitution,
  ICICI: '340' as BankInstitution,
  ManulifeBank: '352' as BankInstitution,
  ManulifeBank_540: '540' as BankInstitution,
  ICICI_614: '614' as BankInstitution,
  Central1BCON: '809' as BankInstitution,
  CaissePopDesjardins: '815' as BankInstitution,
  Central1ONCUs: '828' as BankInstitution,
  Desjardins: '829' as BankInstitution,
  MeridianOEECU: '837' as BankInstitution,
  HeritageCU: '839' as BankInstitution,
  CaissesPopulairesAcadiennes: '849' as BankInstitution,
  VariousCreditUnions: '879' as BankInstitution
});

const VALID_INSTITUTIONS: ReadonlySet<string> = new Set(Object.values(BankInstitution));

export class BankPADInformation {
  /**
   * 3-digit Canadian financial institution number, validated against the
   * known-good list (e.g. "003" RBC, "001" BMO, "010" CIBC, "004" TD).
   */
  static bankInstitution(value: string): BankInstitution {
    if (!VALID_INSTITUTIONS.has(value)) {
      throw new Error(
        `bankInstitutionNumber is not a recognised Canadian FI: "${value}"`
      );
    }
    return value as BankInstitution;
  }

  /**
   * 5-digit branch / transit number.
   */
  static bankTransit(value: string): BankTransit {
    if (!TRANSIT_PATTERN.test(value)) {
      throw new Error(`bankTransitNumber must be exactly 5 digits: "${value}"`);
    }
    return value as BankTransit;
  }

  /**
   * 5- to 12-digit account number.
   */
  static bankAccount(value: string): BankAccount {
    if (!ACCOUNT_PATTERN.test(value)) {
      throw new Error(`bankAccountNumber must be 5 to 12 digits: "${value}"`);
    }
    return value as BankAccount;
  }
}
