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
 * published by Payments Canada. Mirrors the list at
 * https://wise.com/help/articles/2666692/canadian-institution-numbers.
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
  RBSCanada: '240' as BankInstitution,
  BankOfAmericaNA: '241' as BankInstitution,
  BNYMellon: '242' as BankInstitution,
  BTMUCanada: '245' as BankInstitution,
  BNPParibasCanada: '250' as BankInstitution,
  CitibankCanada: '260' as BankInstitution,
  DeutscheBank: '265' as BankInstitution,
  MegaInternationalCommercialBank: '269' as BankInstitution,
  JPMorganChaseNA: '270' as BankInstitution,
  KoreaExchangeBankCanada: '275' as BankInstitution,
  MizuhoCorporateBank: '277' as BankInstitution,
  UBSCanada: '290' as BankInstitution,
  SocieteGenerale: '292' as BankInstitution,
  StateBankOfIndiaCanada: '294' as BankInstitution,
  SumitomoMitsuiBankingCanada: '301' as BankInstitution,
  AmexBankOfCanada: '303' as BankInstitution,
  ICBCCanada: '307' as BankInstitution,
  BankOfChinaCanada: '308' as BankInstitution,
  CitizensBankOfCanada: '309' as BankInstitution,
  FirstNationsBank: '310' as BankInstitution,
  BofACanadaBank: '311' as BankInstitution,
  JPMorganBankCanada: '314' as BankInstitution,
  CTCBankOfCanada: '315' as BankInstitution,
  USBankNA: '318' as BankInstitution,
  HabibCanadianBank: '321' as BankInstitution,
  Rabobank: '322' as BankInstitution,
  CapitalOneCanada: '323' as BankInstitution,
  StateStreet: '327' as BankInstitution,
  CitibankNA: '328' as BankInstitution,
  ComericaBank: '330' as BankInstitution,
  FirstCommercialBank: '332' as BankInstitution,
  HSBCBankUSA: '333' as BankInstitution,
  PacificAndWesternBank: '334' as BankInstitution,
  UnitedOverseasBank: '335' as BankInstitution,
  MapleBank: '336' as BankInstitution,
  CanadianTireBank: '338' as BankInstitution,
  UBSAGCanada: '339' as BankInstitution,
  ICICI: '340' as BankInstitution,
  BankWest: '342' as BankInstitution,
  DundeeBankOfCanada: '343' as BankInstitution,
  GeneralBankOfCanada: '344' as BankInstitution,
  FifthThirdBank: '345' as BankInstitution,
  SocieteGeneraleON: '346' as BankInstitution,
  BridgewaterBank: '347' as BankInstitution,
  NorthernTrustCompany: '349' as BankInstitution,
  DirectCashBank: '352' as BankInstitution,
  JamesonBank: '354' as BankInstitution,
  ShinhanBankCanada: '355' as BankInstitution,
  MTBank: '357' as BankInstitution,
  HomEquityBank: '358' as BankInstitution,
  WalmartCanadaBank: '359' as BankInstitution,
  BarclaysBank: '360' as BankInstitution,
  MonCanaBank: '361' as BankInstitution,
  CommunityTrustCompany: '507' as BankInstitution,
  CanadaTrustCompany: '509' as BankInstitution,
  LaurentianTrustOfCanada: '522' as BankInstitution,
  EffortTrustCompany: '532' as BankInstitution,
  InvestorsGroupTrust: '536' as BankInstitution,
  ManulifeBank: '540' as BankInstitution,
  CIBCTrustCorporation: '548' as BankInstitution,
  MontrealTrustCompany: '550' as BankInstitution,
  SunLifeFinancialTrust: '551' as BankInstitution,
  PeaceHillsTrust: '568' as BankInstitution,
  RoyalTrustCompany: '570' as BankInstitution,
  RoyalTrustCorporation: '580' as BankInstitution,
  NationalTrustCompany: '590' as BankInstitution,
  RoyalBankMortgage: '592' as BankInstitution,
  TDMortgage: '597' as BankInstitution,
  TDPacificMortgage: '603' as BankInstitution,
  HSBCMortgage: '604' as BankInstitution,
  ScotiaMortgage: '606' as BankInstitution,
  CSAlternaBank: '608' as BankInstitution,
  TangerineBank: '614' as BankInstitution,
  B2BBank: '618' as BankInstitution,
  ResMorTrust: '620' as BankInstitution,
  PeoplesTrust: '621' as BankInstitution,
  EquitableTrust: '623' as BankInstitution,
  IndustrialAllianceTrust: '625' as BankInstitution,
  ManulifeTrust: '626' as BankInstitution,
  HouseholdTrust: '630' as BankInstitution,
  LatvianCreditUnion: '803' as BankInstitution,
  CommunicationTechnologiesCU: '807' as BankInstitution,
  ArnsteinCommunityCU: '808' as BankInstitution,
  Central1BC: '809' as BankInstitution,
  AllTransFinancialServicesCU: '810' as BankInstitution,
  CaisseCentraleDesjardins: '815' as BankInstitution,
  FederationCaissesPopulairesMB: '819' as BankInstitution,
  Central1ON: '828' as BankInstitution,
  FederationCaissesPopulairesON: '829' as BankInstitution,
  AirlineFinancialCU: '830' as BankInstitution,
  MeridianCU: '837' as BankInstitution,
  AtlanticCentral: '839' as BankInstitution,
  AlternaSavings: '842' as BankInstitution,
  GoderichCommunityCU: '844' as BankInstitution,
  OntarioCivilServiceCU: '846' as BankInstitution,
  ConcentraFinancial: '853' as BankInstitution,
  GoldenHorseshoeCU: '854' as BankInstitution,
  CaissesPopulairesAcadiennes: '865' as BankInstitution,
  CreditUnionCentralMB: '879' as BankInstitution,
  CreditUnionCentralSK: '889' as BankInstitution,
  AllianceCaissesPopulairesON: '890' as BankInstitution,
  CreditUnionCentralAB: '899' as BankInstitution
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
