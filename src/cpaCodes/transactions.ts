import { cpaTransactionCodesCommercial } from '#cpaCodes/transactions/commercial';
import { cpaTransactionCodesFederal } from '#cpaCodes/transactions/federal';
import { cpaTransactionCodesPreauthorized } from '#cpaCodes/transactions/preauthorized';
import { cpaTransactionCodesProvincialLocal } from '#cpaCodes/transactions/provincialLocal';
import type { CPACode, CPACodeNumber } from '#types';

export const cpaTransactionCodes = {
  ...cpaTransactionCodesPreauthorized,
  ...cpaTransactionCodesFederal,
  ...cpaTransactionCodesProvincialLocal,
  ...cpaTransactionCodesCommercial
} as const satisfies Record<CPACodeNumber, CPACode>;

type CPATransactionCodeKey = keyof typeof cpaTransactionCodes;
/** Stringified literal union of every recognised CPA transaction code. */
export type CPATransactionCode = `${CPATransactionCodeKey}`;

export function isCPATransactionCode(cpaCode: string): cpaCode is CPATransactionCode {
  return Object.hasOwn(cpaTransactionCodes, cpaCode);
}
