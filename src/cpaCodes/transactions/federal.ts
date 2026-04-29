import type { CPACode, CPACodeString } from '#types';

export const cpaTransactionCodesFederal = {
  300: {
    cpaCodeFullName: 'Federal Payment',
    cpaCodeAbbreviationEnglish: 'FED',
    cpaCodeAbbreviationFrench: 'FED'
  },
  301: {
    cpaCodeFullName: 'Agri Stabilization',
    cpaCodeAbbreviationEnglish: 'AGR',
    cpaCodeAbbreviationFrench: 'AGR'
  },
  302: {
    cpaCodeFullName: 'AgriInvest',
    cpaCodeAbbreviationEnglish: 'AGI',
    cpaCodeAbbreviationFrench: 'AGI'
  },
  303: {
    cpaCodeFullName: 'HRDC - Training',
    cpaCodeAbbreviationEnglish: 'HRD',
    cpaCodeAbbreviationFrench: 'DRH'
  },
  308: {
    cpaCodeFullName: 'Canada Child Benefit',
    cpaCodeAbbreviationEnglish: 'CCB',
    cpaCodeAbbreviationFrench: 'ACE'
  },
  309: {
    cpaCodeFullName: 'GST',
    cpaCodeAbbreviationEnglish: 'GST',
    cpaCodeAbbreviationFrench: 'TPS'
  },
  310: {
    cpaCodeFullName: 'CPP',
    cpaCodeAbbreviationEnglish: 'CPP',
    cpaCodeAbbreviationFrench: 'RPC'
  },
  311: {
    cpaCodeFullName: 'Old Age Security',
    cpaCodeAbbreviationEnglish: 'OAS',
    cpaCodeAbbreviationFrench: 'SV'
  },
  312: {
    cpaCodeFullName: "War Veterans' Allowance",
    cpaCodeAbbreviationEnglish: 'WVA',
    cpaCodeAbbreviationFrench: 'AAC'
  },
  313: {
    cpaCodeFullName: 'VAC',
    cpaCodeAbbreviationEnglish: 'VAC',
    cpaCodeAbbreviationFrench: 'ACC'
  },
  315: {
    cpaCodeFullName: 'PS Superannuation',
    cpaCodeAbbreviationEnglish: 'PSS',
    cpaCodeAbbreviationFrench: 'PFP'
  },
  316: {
    cpaCodeFullName: 'CF Superannuation',
    cpaCodeAbbreviationEnglish: 'CFS',
    cpaCodeAbbreviationFrench: 'PFC'
  },
  317: {
    cpaCodeFullName: 'Tax Refund',
    cpaCodeAbbreviationEnglish: 'RIT',
    cpaCodeAbbreviationFrench: 'RIF'
  },
  318: {
    cpaCodeFullName: 'EI',
    cpaCodeAbbreviationEnglish: 'EI',
    cpaCodeAbbreviationFrench: 'AE'
  },
  319: {
    cpaCodeFullName: 'PAD CCRA',
    cpaCodeAbbreviationEnglish: 'TXD',
    cpaCodeAbbreviationFrench: 'DIM'
  },
  320: {
    cpaCodeFullName: 'Student Loan',
    cpaCodeAbbreviationEnglish: 'GSL',
    cpaCodeAbbreviationFrench: 'ETU'
  },
  321: {
    cpaCodeFullName: 'CSB Interest',
    cpaCodeAbbreviationEnglish: 'CSB',
    cpaCodeAbbreviationFrench: 'OEC'
  },
  322: {
    cpaCodeFullName: 'External Affairs',
    cpaCodeAbbreviationEnglish: 'EXT',
    cpaCodeAbbreviationFrench: 'EXT'
  },
  323: {
    cpaCodeFullName: 'Savings Plan',
    cpaCodeAbbreviationEnglish: 'CSP',
    cpaCodeAbbreviationFrench: 'PEC'
  },
  324: {
    cpaCodeFullName: 'Access Grants',
    cpaCodeAbbreviationEnglish: 'CAG',
    cpaCodeAbbreviationFrench: 'SCA'
  },
  325: {
    cpaCodeFullName: 'Canada Carbon Rebate',
    cpaCodeAbbreviationEnglish: 'CCR',
    cpaCodeAbbreviationFrench: 'RCC'
  }
} as const satisfies Record<CPACodeString, CPACode>;
