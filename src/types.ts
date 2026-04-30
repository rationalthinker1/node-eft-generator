import type { BankAccount, BankInstitution, BankTransit } from '#BankPADInformation';
import type { CPATransactionCode } from '#cpaCodes/transactions';

export interface EFTConfiguration {
  /**
   * Also known as
   * - Client Number
   * - Company ID
   * - Customer Number
   */
  originatorId: string;

  originatorShortName: string;
  originatorLongName: string;

  /**
   * Four digit number.
   * Should be different from previous 10 numbers submitted for processing.
   */
  fileCreationNumber: string;

  /**
   * If not set, will use today.
   */
  fileCreationDate?: Date;

  /**
   * Also known as:
   * - Processing Centre
   *
   * Required by both BMO and RBC CPA-005 specs (header field 06, positions 31-35).
   */
  destinationDataCentre: string;

  destinationCurrency?: 'CAD' | 'USD';

  returnInstitutionNumber?: BankInstitution;
  returnTransitNumber?: BankTransit;
  returnAccountNumber?: BankAccount;
}

export const TRANSACTION_TYPE = {
  CREDIT: 'C',
  DEBIT: 'D'
} as const;

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]; // 'C' | 'D'

export const RECORD_TYPE = {
  HEADER: 'A',
  TRANSACTION_CREDIT: 'C',
  TRANSACTION_DEBIT: 'D',
  TRAILER: 'Z'
} as const;

export interface EFTTransaction {
  /**
   * C = Credit - sending funds
   * D = Debit  - receiving funds
   */
  recordType: TransactionType;

  segments: EFTTransactionSegment[];
}

export interface EFTTransactionSegment {
  cpaCode: CPATransactionCode;

  /**
   * In dollars
   */
  amount: number;

  paymentDate: Date;

  bankInstitutionNumber: BankInstitution;
  bankTransitNumber: BankTransit;
  bankAccountNumber: BankAccount;

  payeeName: string;

  crossReferenceNumber?: string;
}

export type CPACodeNumber = number;

export interface CPACode {
  cpaCodeFullName: string;
  cpaCodeAbbreviationEnglish: string;
  cpaCodeAbbreviationFrench: string;
}
