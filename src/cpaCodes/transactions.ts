import { cpaTransactionCodesCommercial } from '#cpaCodes/transactions/commercial';
import { cpaTransactionCodesFederal } from '#cpaCodes/transactions/federal';
import { cpaTransactionCodesPreauthorized } from '#cpaCodes/transactions/preauthorized';
import { cpaTransactionCodesProvincialLocal } from '#cpaCodes/transactions/provincialLocal';
import type { CPACode, CPACodeString } from '#types';

export const cpaTransactionCodes = {
  ...cpaTransactionCodesPreauthorized,
  ...cpaTransactionCodesFederal,
  ...cpaTransactionCodesProvincialLocal,
  ...cpaTransactionCodesCommercial
} as const satisfies Record<CPACodeString, CPACode>;

export type CPATransactionCode = keyof typeof cpaTransactionCodes;

export function isCPATransactionCode(cpaCode: string | CPATransactionCode): cpaCode is CPATransactionCode {
  return Object.hasOwn(cpaTransactionCodes, cpaCode);
}
