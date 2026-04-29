import type { CPACode, CPACodeNumber } from '#types';

export const cpaTransactionCodesCommercial = {
  701: {
    cpaCodeFullName: 'Commercial Investments',
    cpaCodeAbbreviationEnglish: 'CIV',
    cpaCodeAbbreviationFrench: 'PLE'
  },
  702: {
    cpaCodeFullName: 'Commercial Insurance',
    cpaCodeAbbreviationEnglish: 'CIN',
    cpaCodeAbbreviationFrench: 'ASE'
  },
  703: {
    cpaCodeFullName: 'Commercial Auto Insurance',
    cpaCodeAbbreviationEnglish: 'CAI',
    cpaCodeAbbreviationFrench: 'AUE'
  },
  704: {
    cpaCodeFullName: 'Commercial Property Insurance',
    cpaCodeAbbreviationEnglish: 'CPI',
    cpaCodeAbbreviationFrench: 'ABE'
  },
  705: {
    cpaCodeFullName: 'Commercial Casualty Insurance',
    cpaCodeAbbreviationEnglish: 'CCI',
    cpaCodeAbbreviationFrench: 'ARE'
  },
  706: {
    cpaCodeFullName: 'Commercial Mortgage Insurance',
    cpaCodeAbbreviationEnglish: 'CMI',
    cpaCodeAbbreviationFrench: 'AHE'
  },
  707: {
    cpaCodeFullName: 'Commercial Loans',
    cpaCodeAbbreviationEnglish: 'CLN',
    cpaCodeAbbreviationFrench: 'PEE'
  },
  708: {
    cpaCodeFullName: 'Commercial Mortgage',
    cpaCodeAbbreviationEnglish: 'CMG',
    cpaCodeAbbreviationFrench: 'HYE'
  },
  709: {
    cpaCodeFullName: 'Commercial Taxes',
    cpaCodeAbbreviationEnglish: 'CTX',
    cpaCodeAbbreviationFrench: 'TXE'
  },
  710: {
    cpaCodeFullName: 'Commercial Income Taxes',
    cpaCodeAbbreviationEnglish: 'CIT',
    cpaCodeAbbreviationFrench: 'IRE'
  },
  711: {
    cpaCodeFullName: 'Commercial Sales Taxes',
    cpaCodeAbbreviationEnglish: 'CSL',
    cpaCodeAbbreviationFrench: 'TVE'
  },
  712: {
    cpaCodeFullName: 'Commercial GST',
    cpaCodeAbbreviationEnglish: 'CGT',
    cpaCodeAbbreviationFrench: 'TPE'
  },
  713: {
    cpaCodeFullName: 'Commercial Property Taxes',
    cpaCodeAbbreviationEnglish: 'CPT',
    cpaCodeAbbreviationFrench: 'TFE'
  },
  714: {
    cpaCodeFullName: 'Commercial Rent/Lease',
    cpaCodeAbbreviationEnglish: 'CRL',
    cpaCodeAbbreviationFrench: 'LBE'
  },
  715: {
    cpaCodeFullName: 'Commercial Equipment Rent/Lease',
    cpaCodeAbbreviationEnglish: 'CER',
    cpaCodeAbbreviationFrench: 'LME'
  },
  716: {
    cpaCodeFullName: 'Commercial Automobile Rent/Lease',
    cpaCodeAbbreviationEnglish: 'CAR',
    cpaCodeAbbreviationFrench: 'LAE'
  },
  717: {
    cpaCodeFullName: 'Commercial Cash Management',
    cpaCodeAbbreviationEnglish: 'CCM',
    cpaCodeAbbreviationFrench: 'GEE'
  },
  718: {
    cpaCodeFullName: 'Commercial Bill Payment',
    cpaCodeAbbreviationEnglish: 'CBP',
    cpaCodeAbbreviationFrench: 'PFE'
  },
  719: {
    cpaCodeFullName: 'Commercial Telephone Bill Payment',
    cpaCodeAbbreviationEnglish: 'CTB',
    cpaCodeAbbreviationFrench: 'PTE'
  },
  720: {
    cpaCodeFullName: 'Commercial Gasoline Bill Payment',
    cpaCodeAbbreviationEnglish: 'CGB',
    cpaCodeAbbreviationFrench: 'ESE'
  },
  721: {
    cpaCodeFullName: 'Commercial Hydro Bill Payment',
    cpaCodeAbbreviationEnglish: 'CHB',
    cpaCodeAbbreviationFrench: 'ELE'
  },
  722: {
    cpaCodeFullName: 'Commercial Cable Bill Payment',
    cpaCodeAbbreviationEnglish: 'CCB',
    cpaCodeAbbreviationFrench: 'PCE'
  },
  723: {
    cpaCodeFullName: 'Commercial Fuel Bill Payment',
    cpaCodeAbbreviationEnglish: 'CFB',
    cpaCodeAbbreviationFrench: 'CBE'
  },
  724: {
    cpaCodeFullName: 'Commercial Utility Bill Payment',
    cpaCodeAbbreviationEnglish: 'CUB',
    cpaCodeAbbreviationFrench: 'UPE'
  },
  725: {
    cpaCodeFullName: 'Commercial Internet Bill Payment',
    cpaCodeAbbreviationEnglish: 'CIB',
    cpaCodeAbbreviationFrench: 'AIE'
  },
  726: {
    cpaCodeFullName: 'Commercial Water Bill Payment',
    cpaCodeAbbreviationEnglish: 'CWB',
    cpaCodeAbbreviationFrench: 'CEE'
  },
  727: {
    cpaCodeFullName: 'Commercial Auto Payment',
    cpaCodeAbbreviationEnglish: 'CAB',
    cpaCodeAbbreviationFrench: 'PAE'
  },
  728: {
    cpaCodeFullName: 'Commercial Expense Payment',
    cpaCodeAbbreviationEnglish: 'CEP',
    cpaCodeAbbreviationFrench: 'RDE'
  },
  729: {
    cpaCodeFullName: 'Commercial Accounts Payable',
    cpaCodeAbbreviationEnglish: 'CAP',
    cpaCodeAbbreviationFrench: 'CDE'
  },
  730: {
    cpaCodeFullName: 'Commercial Fees/Dues',
    cpaCodeAbbreviationEnglish: 'CFD',
    cpaCodeAbbreviationFrench: 'FRE'
  },
  731: {
    cpaCodeFullName: 'Commercial Creditor Insurance',
    cpaCodeAbbreviationEnglish: 'CRI',
    cpaCodeAbbreviationFrench: 'ARC'
  }
} as const satisfies Record<CPACodeNumber, CPACode>;
