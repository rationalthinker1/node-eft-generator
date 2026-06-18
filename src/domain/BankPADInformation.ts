/**
 * String type aliases and validating constructors for the digit fields
 * a CPA-005 Pre-Authorized Debit (PAD) record requires: the routing trio
 * of institution, transit, and account number.
 *
 * The aliases are documentation-only; values are validated at runtime
 * by the corresponding static method on `BankPADInformation`.
 */

const TRANSIT_PATTERN = /^\d{5}$/;
const ACCOUNT_PATTERN = /^\d{5,12}$/;

/**
 * Recognised Canadian 3-digit financial institution numbers, as
 * published by Payments Canada. Mirrors the list at
 * https://wise.com/help/articles/2666692/canadian-institution-numbers.
 */
export const BankInstitutions = Object.freeze({
  BMO: '001',
  Scotia: '002',
  RBC: '003',
  TD: '004',
  NationalBank: '006',
  CIBC: '010',
  HSBC: '016',
  CanadianWestern: '030',
  Laurentian: '039',
  BankOfCanada: '177',
  CanadaSavingsBond: '187',
  ATBFinancial: '219',
  RBSCanada: '240',
  BankOfAmericaNA: '241',
  BNYMellon: '242',
  BTMUCanada: '245',
  BarclaysBankOfCanada: '248',
  BNPParibasCanada: '250',
  CreditSuisseFirstBostonCanada: '258',
  CitibankCanada: '260',
  DeutscheBank: '265',
  MegaInternationalCommercialBank: '269',
  JPMorganChaseNA: '270',
  KoreaExchangeBankCanada: '275',
  MizuhoCorporateBank: '277',
  NationalBankOfGreeceCanada: '286',
  UBSCanada: '290',
  SocieteGenerale: '292',
  StateBankOfIndiaCanada: '294',
  SumitomoMitsuiBankingCanada: '301',
  AmexBankOfCanada: '303',
  ICBCCanada: '307',
  BankOfChinaCanada: '308',
  CitizensBankOfCanada: '309',
  FirstNationsBank: '310',
  BofACanadaBank: '311',
  JPMorganBankCanada: '314',
  CTCBankOfCanada: '315',
  USBankNA: '318',
  PresidentsChoiceBank: '320',
  PresidentsChoiceFinancial: '326',
  HabibCanadianBank: '321',
  Rabobank: '322',
  CapitalOneCanada: '323',
  StateStreet: '327',
  CitibankNA: '328',
  ComericaBank: '330',
  FirstCommercialBank: '332',
  HSBCBankUSA: '333',
  PacificAndWesternBank: '334',
  UnitedOverseasBank: '335',
  MapleBank: '336',
  CanadianTireBank: '338',
  UBSAGCanada: '339',
  ICICI: '340',
  BankWest: '342',
  DundeeBankOfCanada: '343',
  GeneralBankOfCanada: '344',
  FifthThirdBank: '345',
  SocieteGeneraleON: '346',
  BridgewaterBank: '347',
  NorthernTrustCompany: '349',
  DirectCashBank: '352',
  JamesonBank: '354',
  ShinhanBankCanada: '355',
  MTBank: '357',
  HomEquityBank: '358',
  WalmartCanadaBank: '359',
  BarclaysBank: '360',
  MonCanaBank: '361',
  WellsFargoBankCanada: '362',
  PNCBankCanada: '365',
  ChinaConstructionBankToronto: '366',
  WealthOneBankOfCanada: '370',
  BankOfChinaTorontoBranch: '372',
  MotusBank: '374',
  ExchangeBankOfCanada: '376',
  CidelBankCanada: '378',
  PeoplesBankOfCanada: '383',
  TrustGeneralInc: '506',
  CommunityTrustCompany: '507',
  CanadaTrustCompany: '509',
  LaurentianTrustOfCanada: '522',
  EffortTrustCompany: '532',
  HomeSavingsAndLoanCorporation: '535',
  InvestorsGroupTrust: '536',
  ManulifeBank: '540',
  MontrealTrust: '544',
  MennoniteTrustLimited: '547',
  CIBCTrustCorporation: '548',
  MontrealTrustCompany: '550',
  SunLifeFinancialTrust: '551',
  PeaceHillsTrust: '568',
  RoyalTrustCompany: '570',
  RoyalTrustCorporation: '580',
  NationalTrustCompany: '590',
  RoyalBankMortgage: '592',
  TDMortgage: '597',
  TDPacificMortgage: '603',
  HSBCMortgage: '604',
  ScotiaMortgage: '606',
  CSAlternaBank: '608',
  NatcanTrustCompany: '612',
  TDTrustCompany: '613',
  TangerineBank: '614',
  B2BBank: '618',
  ResMorTrust: '620',
  PeoplesTrust: '621',
  EquitableTrust: '623',
  IndustrialAllianceTrust: '625',
  ManulifeTrust: '626',
  HouseholdTrust: '630',
  EdwardJones: '701',
  Wealthsimple: '703',
  LatvianCreditUnion: '803',
  CommunicationTechnologiesCU: '807',
  ArnsteinCommunityCU: '808',
  Central1BC: '809',
  AllTransFinancialServicesCU: '810',
  CaisseCentraleDesjardins: '815',
  FederationCaissesPopulairesMB: '819',
  CreditUnionsInNovaScotia: '821',
  Central1ON: '828',
  FederationCaissesPopulairesON: '829',
  AirlineFinancialCU: '830',
  CreditUnionsInNewBrunswick: '831',
  CaissePopulaireDeKapuskasing: '836',
  MeridianCU: '837',
  AtlanticCentral: '839',
  CreditUnionsInQuebec: '841',
  AlternaSavings: '842',
  GoderichCommunityCU: '844',
  OntarioCivilServiceCU: '846',
  BrunswickCreditUnionFederation: '849',
  CreditUnionsInOntario: '851',
  ConcentraFinancial: '853',
  GoldenHorseshoeCU: '854',
  CaissesPopulairesAcadiennes: '865',
  CreditUnionCentralMB: '879',
  CreditUnionCentralSK: '889',
  AllianceCaissesPopulairesON: '890',
  CreditUnionCentralAB: '899'
});

export type BankInstitution = (typeof BankInstitutions)[keyof typeof BankInstitutions];
export type BankTransit = `${number}`;
export type BankAccount = `${number}`;

const VALID_INSTITUTIONS: ReadonlySet<string> = new Set(Object.values(BankInstitutions));

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
