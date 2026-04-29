import { cpaTransactionCodesCommercial } from '#cpaCodes/transactions/commercial';
import { cpaTransactionCodesFederal } from '#cpaCodes/transactions/federal';
import { cpaTransactionCodesPreauthorized } from '#cpaCodes/transactions/preauthorized';
import { cpaTransactionCodesProvincialLocal } from '#cpaCodes/transactions/provincialLocal';
import type { CPACode, CPACodeString } from '#types';

export const cpaTransactionCodes: Record<CPACodeString, CPACode> = {
  ...cpaTransactionCodesPreauthorized,
  ...cpaTransactionCodesFederal,
  ...cpaTransactionCodesProvincialLocal,
  ...cpaTransactionCodesCommercial
};

export function isCPATransactionCode(cpaCode: string): boolean {
  return Object.hasOwn(cpaTransactionCodes, cpaCode);
}
