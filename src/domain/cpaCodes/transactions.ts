import { cpaTransactionCodesCommercial } from '#domain/cpaCodes/transactions/commercial';
import { cpaTransactionCodesFederal } from '#domain/cpaCodes/transactions/federal';
import { cpaTransactionCodesPreauthorized } from '#domain/cpaCodes/transactions/preauthorized';
import { cpaTransactionCodesProvincialLocal } from '#domain/cpaCodes/transactions/provincialLocal';
import type { CPACode, CPACodeNumber } from '#domain/types';

const cpaTransactionCodes = {
  ...cpaTransactionCodesPreauthorized,
  ...cpaTransactionCodesFederal,
  ...cpaTransactionCodesProvincialLocal,
  ...cpaTransactionCodesCommercial
} as const satisfies Record<CPACodeNumber, CPACode>;

type CPATransactionCodeKey = keyof typeof cpaTransactionCodes;
/** Stringified literal union of every recognised CPA transaction code. */
export type CPATransactionCode = `${CPATransactionCodeKey}`;

export class CPATransactionCodes {
  /** All recognised CPA-005 transaction codes keyed by their numeric value. */
  static readonly all = cpaTransactionCodes;

  /** Type guard for whether a string is a recognised CPA transaction code. */
  static is(cpaCode: string): cpaCode is CPATransactionCode {
    return Object.hasOwn(cpaTransactionCodes, cpaCode);
  }
}
