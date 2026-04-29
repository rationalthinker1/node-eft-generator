export interface EFTConfiguration {
  /**
   * Also known as
   * - Client Number
   * - Company ID
   * - Customer Number
   */
  originatorId: string;

  originatorShortName?: string;
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
   */
  destinationDataCentre?: string;

  destinationCurrency?: 'CAD' | 'USD';

  /**
   * Three digits
   */
  returnInstitutionNumber?: string;

  /**
   * Five digits
   */
  returnTransitNumber?: string;

  /**
   * Up to 12 digits
   */
  returnAccountNumber?: string;
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
export type RecordType = (typeof RECORD_TYPE)[keyof typeof RECORD_TYPE]; // 'A' | 'C' | 'D' | 'Z'

export interface EFTTransaction {
  /**
   * C = Credit - sending funds
   * D = Debit  - receiving funds
   */
  recordType: TransactionType;

  segments: EFTTransactionSegment[];
}

export interface EFTTransactionSegment {
  cpaCode: `${number}`;

  /**
   * In dollars
   */
  amount: number;

  /**
   * If not set, will use today.
   */
  paymentDate?: Date;

  /**
   * Three digits
   */
  bankInstitutionNumber: `${number}`;

  /**
   * Five digits
   */
  bankTransitNumber: `${number}`;

  /**
   * 5-12 digits
   */
  bankAccountNumber: `${number}`;

  payeeName: string;

  crossReferenceNumber?: string;
}

export type ValidationWarning = {
  warning: string;
} & (
  | {
      warningField: keyof EFTConfiguration | 'transactions';
    }
  | {
      transactionIndex: number;
      warningField: keyof EFTTransaction;
    }
  | {
      transactionIndex: number;
      transactionSegmentIndex: number;
      warningField: keyof EFTTransactionSegment;
    }
);

export type CPACodeString = number;

export interface CPACode {
  cpaCodeFullName: string;
  cpaCodeAbbreviationEnglish: string;
  cpaCodeAbbreviationFrench: string;
}
