import type { CPACode, CPACodeNumber } from '#types';

export const cpaTransactionCodesPreauthorized = {
  200: {
    cpaCodeFullName: 'Payroll Deposit',
    cpaCodeAbbreviationEnglish: 'PAY',
    cpaCodeAbbreviationFrench: 'PAY'
  },
  201: {
    cpaCodeFullName: 'Special Payroll',
    cpaCodeAbbreviationEnglish: 'PAY',
    cpaCodeAbbreviationFrench: 'PAY'
  },
  202: {
    cpaCodeFullName: 'Vacation Payroll',
    cpaCodeAbbreviationEnglish: 'PAY',
    cpaCodeAbbreviationFrench: 'PAY'
  },
  203: {
    cpaCodeFullName: 'Overtime Payroll',
    cpaCodeAbbreviationEnglish: 'PAY',
    cpaCodeAbbreviationFrench: 'PAY'
  },
  204: {
    cpaCodeFullName: 'Advance Payroll',
    cpaCodeAbbreviationEnglish: 'PAY',
    cpaCodeAbbreviationFrench: 'PAY'
  },
  205: {
    cpaCodeFullName: 'Commission Payroll',
    cpaCodeAbbreviationEnglish: 'PAY',
    cpaCodeAbbreviationFrench: 'PAY'
  },
  206: {
    cpaCodeFullName: 'Bonus Payroll',
    cpaCodeAbbreviationEnglish: 'PAY',
    cpaCodeAbbreviationFrench: 'PAY'
  },
  207: {
    cpaCodeFullName: 'Adjustment Payroll',
    cpaCodeAbbreviationEnglish: 'PAY',
    cpaCodeAbbreviationFrench: 'PAY'
  },
  230: {
    cpaCodeFullName: 'Pension',
    cpaCodeAbbreviationEnglish: 'PEN',
    cpaCodeAbbreviationFrench: 'PEN'
  },
  231: {
    cpaCodeFullName: 'Federal Pension',
    cpaCodeAbbreviationEnglish: 'PEN',
    cpaCodeAbbreviationFrench: 'PEN'
  },
  232: {
    cpaCodeFullName: 'Provincial Pension',
    cpaCodeAbbreviationEnglish: 'PEN',
    cpaCodeAbbreviationFrench: 'PEN'
  },
  233: {
    cpaCodeFullName: 'Private Pension',
    cpaCodeAbbreviationEnglish: 'PEN',
    cpaCodeAbbreviationFrench: 'PEN'
  },
  240: {
    cpaCodeFullName: 'Annuity',
    cpaCodeAbbreviationEnglish: 'ANN',
    cpaCodeAbbreviationFrench: 'REN'
  },
  250: {
    cpaCodeFullName: 'Dividend',
    cpaCodeAbbreviationEnglish: 'DIV',
    cpaCodeAbbreviationFrench: 'DVD'
  },
  251: {
    cpaCodeFullName: 'Common Dividend',
    cpaCodeAbbreviationEnglish: 'DIV',
    cpaCodeAbbreviationFrench: 'DVD'
  },
  252: {
    cpaCodeFullName: 'Preferred Dividend',
    cpaCodeAbbreviationEnglish: 'DIV',
    cpaCodeAbbreviationFrench: 'DVD'
  },
  260: {
    cpaCodeFullName: 'Investment',
    cpaCodeAbbreviationEnglish: 'INV',
    cpaCodeAbbreviationFrench: 'PLA'
  },
  261: {
    cpaCodeFullName: 'Mutual Funds',
    cpaCodeAbbreviationEnglish: 'MTF',
    cpaCodeAbbreviationFrench: 'FMU'
  },
  265: {
    cpaCodeFullName: 'Spousal RSP Contribution',
    cpaCodeAbbreviationEnglish: 'SRP',
    cpaCodeAbbreviationFrench: 'RDC'
  },
  266: {
    cpaCodeFullName: 'RESP Contribution',
    cpaCodeAbbreviationEnglish: 'REP',
    cpaCodeAbbreviationFrench: 'REE'
  },
  271: {
    cpaCodeFullName: 'RSP Contribution',
    cpaCodeAbbreviationEnglish: 'RSP',
    cpaCodeAbbreviationFrench: 'RER'
  },
  272: {
    cpaCodeFullName: 'Retirement Income Fund',
    cpaCodeAbbreviationEnglish: 'RIF',
    cpaCodeAbbreviationFrench: 'FRR'
  },
  273: {
    cpaCodeFullName: 'Tax Free Savings Account',
    cpaCodeAbbreviationEnglish: 'TFS',
    cpaCodeAbbreviationFrench: 'CLI'
  },
  274: {
    cpaCodeFullName: 'RDSP Contribution',
    cpaCodeAbbreviationEnglish: 'RDP',
    cpaCodeAbbreviationFrench: 'REI'
  },
  280: {
    cpaCodeFullName: 'Interest',
    cpaCodeAbbreviationEnglish: 'INT',
    cpaCodeAbbreviationFrench: 'INT'
  },
  281: {
    cpaCodeFullName: 'Lottery Prize Payment',
    cpaCodeAbbreviationEnglish: 'LPP',
    cpaCodeAbbreviationFrench: 'PDL'
  },
  330: {
    cpaCodeFullName: 'Insurance',
    cpaCodeAbbreviationEnglish: 'INS',
    cpaCodeAbbreviationFrench: 'ASS'
  },
  331: {
    cpaCodeFullName: 'Life Insurance',
    cpaCodeAbbreviationEnglish: 'INS',
    cpaCodeAbbreviationFrench: 'ASS'
  },
  332: {
    cpaCodeFullName: 'Auto Insurance',
    cpaCodeAbbreviationEnglish: 'INS',
    cpaCodeAbbreviationFrench: 'ASS'
  },
  333: {
    cpaCodeFullName: 'Property Insurance',
    cpaCodeAbbreviationEnglish: 'INS',
    cpaCodeAbbreviationFrench: 'ASS'
  },
  334: {
    cpaCodeFullName: 'Casualty Insurance',
    cpaCodeAbbreviationEnglish: 'INS',
    cpaCodeAbbreviationFrench: 'ASS'
  },
  335: {
    cpaCodeFullName: 'Mortgage Insurance',
    cpaCodeAbbreviationEnglish: 'INS',
    cpaCodeAbbreviationFrench: 'ASS'
  },
  336: {
    cpaCodeFullName: 'Health/Dental Claim Insurance',
    cpaCodeAbbreviationEnglish: 'HDC',
    cpaCodeAbbreviationFrench: 'SDR'
  },
  350: {
    cpaCodeFullName: 'Loans',
    cpaCodeAbbreviationEnglish: 'LNS',
    cpaCodeAbbreviationFrench: 'PRE'
  },
  351: {
    cpaCodeFullName: 'Personal Loans',
    cpaCodeAbbreviationEnglish: 'LNS',
    cpaCodeAbbreviationFrench: 'PRE'
  },
  352: {
    cpaCodeFullName: 'Dealer Plan Loans',
    cpaCodeAbbreviationEnglish: 'LNS',
    cpaCodeAbbreviationFrench: 'PRE'
  },
  353: {
    cpaCodeFullName: 'Farm Improvement Loans',
    cpaCodeAbbreviationEnglish: 'LNS',
    cpaCodeAbbreviationFrench: 'PRE'
  },
  354: {
    cpaCodeFullName: 'Home Improvement Loans',
    cpaCodeAbbreviationEnglish: 'LNS',
    cpaCodeAbbreviationFrench: 'PRE'
  },
  355: {
    cpaCodeFullName: 'Term Loans',
    cpaCodeAbbreviationEnglish: 'LNS',
    cpaCodeAbbreviationFrench: 'PRE'
  },
  356: {
    cpaCodeFullName: 'Insurance Loans',
    cpaCodeAbbreviationEnglish: 'LNS',
    cpaCodeAbbreviationFrench: 'PRE'
  },
  370: {
    cpaCodeFullName: 'Mortgage',
    cpaCodeAbbreviationEnglish: 'MTG',
    cpaCodeAbbreviationFrench: 'HYP'
  },
  371: {
    cpaCodeFullName: 'Residential Mortgage',
    cpaCodeAbbreviationEnglish: 'MTG',
    cpaCodeAbbreviationFrench: 'HYP'
  },
  372: {
    cpaCodeFullName: 'Commercial Mortgage',
    cpaCodeAbbreviationEnglish: 'MTG',
    cpaCodeAbbreviationFrench: 'HYP'
  },
  373: {
    cpaCodeFullName: 'Farm Mortgage',
    cpaCodeAbbreviationEnglish: 'MTG',
    cpaCodeAbbreviationFrench: 'HYP'
  },
  380: {
    cpaCodeFullName: 'Taxes',
    cpaCodeAbbreviationEnglish: 'TAX',
    cpaCodeAbbreviationFrench: 'TAX'
  },
  381: {
    cpaCodeFullName: 'Income Taxes',
    cpaCodeAbbreviationEnglish: 'TAX',
    cpaCodeAbbreviationFrench: 'TAX'
  },
  382: {
    cpaCodeFullName: 'Sales Taxes',
    cpaCodeAbbreviationEnglish: 'TAX',
    cpaCodeAbbreviationFrench: 'TAX'
  },
  383: {
    cpaCodeFullName: 'Corporate Taxes',
    cpaCodeAbbreviationEnglish: 'TAX',
    cpaCodeAbbreviationFrench: 'TAX'
  },
  384: {
    cpaCodeFullName: 'School Taxes',
    cpaCodeAbbreviationEnglish: 'TAX',
    cpaCodeAbbreviationFrench: 'TAX'
  },
  385: {
    cpaCodeFullName: 'Property Taxes',
    cpaCodeAbbreviationEnglish: 'TAX',
    cpaCodeAbbreviationFrench: 'TAX'
  },
  386: {
    cpaCodeFullName: 'Water Taxes',
    cpaCodeAbbreviationEnglish: 'TAX',
    cpaCodeAbbreviationFrench: 'TAX'
  },
  400: {
    cpaCodeFullName: 'Rent/Leases',
    cpaCodeAbbreviationEnglish: 'RLS',
    cpaCodeAbbreviationFrench: 'LOY'
  },
  401: {
    cpaCodeFullName: 'Residential Rent/Leases',
    cpaCodeAbbreviationEnglish: 'RLS',
    cpaCodeAbbreviationFrench: 'LOY'
  },
  402: {
    cpaCodeFullName: 'Commercial Rent/Leases',
    cpaCodeAbbreviationEnglish: 'RLS',
    cpaCodeAbbreviationFrench: 'LOY'
  },
  403: {
    cpaCodeFullName: 'Equipment Rent/Leases',
    cpaCodeAbbreviationEnglish: 'RLS',
    cpaCodeAbbreviationFrench: 'LOY'
  },
  404: {
    cpaCodeFullName: 'Automobile Rent/Leases',
    cpaCodeAbbreviationEnglish: 'RLS',
    cpaCodeAbbreviationFrench: 'LOY'
  },
  405: {
    cpaCodeFullName: 'Appliance Rent/Leases',
    cpaCodeAbbreviationEnglish: 'RLS',
    cpaCodeAbbreviationFrench: 'LOY'
  },
  420: {
    cpaCodeFullName: 'Cash Management',
    cpaCodeAbbreviationEnglish: 'CMS',
    cpaCodeAbbreviationFrench: 'GES'
  },
  430: {
    cpaCodeFullName: 'Bill Payment',
    cpaCodeAbbreviationEnglish: 'BPY',
    cpaCodeAbbreviationFrench: 'FAC'
  },
  431: {
    cpaCodeFullName: 'Telephone Bill Payment',
    cpaCodeAbbreviationEnglish: 'BPY',
    cpaCodeAbbreviationFrench: 'FAC'
  },
  432: {
    cpaCodeFullName: 'Gasoline Bill Payment',
    cpaCodeAbbreviationEnglish: 'BPY',
    cpaCodeAbbreviationFrench: 'FAC'
  },
  433: {
    cpaCodeFullName: 'Hydro Bill Payment',
    cpaCodeAbbreviationEnglish: 'BPY',
    cpaCodeAbbreviationFrench: 'FAC'
  },
  434: {
    cpaCodeFullName: 'Cable Bill Payment',
    cpaCodeAbbreviationEnglish: 'BPY',
    cpaCodeAbbreviationFrench: 'FAC'
  },
  435: {
    cpaCodeFullName: 'Fuel Bill Payment',
    cpaCodeAbbreviationEnglish: 'BPY',
    cpaCodeAbbreviationFrench: 'FAC'
  },
  436: {
    cpaCodeFullName: 'Utility Bill Payment',
    cpaCodeAbbreviationEnglish: 'BPY',
    cpaCodeAbbreviationFrench: 'FAC'
  },
  437: {
    cpaCodeFullName: 'Internet Access Payment',
    cpaCodeAbbreviationEnglish: 'IAP',
    cpaCodeAbbreviationFrench: 'PAI'
  },
  438: {
    cpaCodeFullName: 'Water Bill Payment',
    cpaCodeAbbreviationEnglish: 'WBP',
    cpaCodeAbbreviationFrench: 'CE'
  },
  439: {
    cpaCodeFullName: 'Auto Payment',
    cpaCodeAbbreviationEnglish: 'APY',
    cpaCodeAbbreviationFrench: 'PAA'
  },
  450: {
    cpaCodeFullName: 'Misc. Payments',
    cpaCodeAbbreviationEnglish: 'MSP',
    cpaCodeAbbreviationFrench: 'DIV'
  },
  451: {
    cpaCodeFullName: 'Customer Cheques',
    cpaCodeAbbreviationEnglish: 'CCQ',
    cpaCodeAbbreviationFrench: 'CHP'
  },
  452: {
    cpaCodeFullName: 'Expense Payment',
    cpaCodeAbbreviationEnglish: 'EXP',
    cpaCodeAbbreviationFrench: 'RDD'
  },
  453: {
    cpaCodeFullName: 'Bill Payment Error Correction',
    cpaCodeAbbreviationEnglish: 'BPC',
    cpaCodeAbbreviationFrench: 'CPF'
  },
  460: {
    cpaCodeFullName: 'Accounts Payable',
    cpaCodeAbbreviationEnglish: 'AP',
    cpaCodeAbbreviationFrench: 'CC'
  },
  470: {
    cpaCodeFullName: 'Fees/Dues',
    cpaCodeAbbreviationEnglish: 'FEE',
    cpaCodeAbbreviationFrench: 'FRA'
  },
  480: {
    cpaCodeFullName: 'Donations',
    cpaCodeAbbreviationEnglish: 'DON',
    cpaCodeAbbreviationFrench: 'DON'
  }
} as const satisfies Record<CPACodeNumber, CPACode>;
