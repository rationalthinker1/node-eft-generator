export { EFTFileBuilder } from '#EFTFileBuilder';
export {
  EFTFileValidator,
  MAX_FILE_TRANSACTION_COUNT,
  RECORD_LENGTH
} from '#EFTFileValidator';
import { HEADER_FIELD_WIDTHS } from '#records/Header';
import { SEGMENT_FIELD_WIDTHS } from '#records/Segment';
export { MAX_SEGMENTS_PER_RECORD } from '#records/Transaction';
export { MAX_TRANSACTION_AMOUNT } from '#records/Segment';
export { Logger } from '#utils/Logger';
export { Header } from '#records/Header';
export { Segment } from '#records/Segment';
export { Transaction } from '#records/Transaction';
export { Trailer } from '#records/Trailer';
export { BankPADInformation } from '#domain/BankPADInformation';
export type {
  BankAccount,
  BankInstitution,
  BankTransit
} from '#domain/BankPADInformation';
export { CPATransactionCodes } from '#domain/CPACodes';
export type { CPATransactionCode } from '#domain/CPACodes';
export type { Loggable, Printable, Validable } from '#types';
export type * as types from '#types';

export const FIELD_WIDTHS = {
  ...HEADER_FIELD_WIDTHS,
  ...SEGMENT_FIELD_WIDTHS
} as const;
