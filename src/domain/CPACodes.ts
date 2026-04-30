import type { CPACode, CPACodeNumber } from '#domain/types';

const cpaTransactionCodesPreauthorized = {
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

const cpaTransactionCodesFederal = {
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
} as const satisfies Record<CPACodeNumber, CPACode>;

const cpaTransactionCodesProvincialLocal = {
  600: {
    cpaCodeFullName: 'Provincial/Local Government Payment',
    cpaCodeAbbreviationEnglish: 'PRO',
    cpaCodeAbbreviationFrench: 'PRO'
  },
  601: {
    cpaCodeFullName: 'Family Support Plan',
    cpaCodeAbbreviationEnglish: 'FSP',
    cpaCodeAbbreviationFrench: 'ROF'
  },
  602: {
    cpaCodeFullName: 'Housing Allowance',
    cpaCodeAbbreviationEnglish: 'HSG',
    cpaCodeAbbreviationFrench: 'LOG'
  },
  603: {
    cpaCodeFullName: 'Income Security Benefits',
    cpaCodeAbbreviationEnglish: 'ISB',
    cpaCodeAbbreviationFrench: 'PSR'
  },
  604: {
    cpaCodeFullName: 'Family Benefit',
    cpaCodeAbbreviationEnglish: 'PFB',
    cpaCodeAbbreviationFrench: 'PFA'
  },
  605: {
    cpaCodeFullName: 'Prov./Terr.',
    cpaCodeAbbreviationEnglish: 'FPT',
    cpaCodeAbbreviationFrench: 'FPT'
  },
  606: {
    cpaCodeFullName: "Workers' Compensation Board",
    cpaCodeAbbreviationEnglish: 'WCB',
    cpaCodeAbbreviationFrench: 'CST'
  },
  607: {
    cpaCodeFullName: 'Employment Assistance Allowance',
    cpaCodeAbbreviationEnglish: 'EAA',
    cpaCodeAbbreviationFrench: 'AAE'
  },
  608: {
    cpaCodeFullName: 'Automobile Insurance Plan',
    cpaCodeAbbreviationEnglish: 'AIP',
    cpaCodeAbbreviationFrench: 'RAA'
  },
  609: {
    cpaCodeFullName: 'Health Care Premium',
    cpaCodeAbbreviationEnglish: 'PHC',
    cpaCodeAbbreviationFrench: 'FAM'
  },
  610: {
    cpaCodeFullName: 'Offences and Fines',
    cpaCodeAbbreviationEnglish: 'OF',
    cpaCodeAbbreviationFrench: 'IA'
  },
  611: {
    cpaCodeFullName: 'Disability Payment',
    cpaCodeAbbreviationEnglish: 'DIS',
    cpaCodeAbbreviationFrench: 'INV'
  },
  612: {
    cpaCodeFullName: 'Parental Insurance',
    cpaCodeAbbreviationEnglish: 'PPI',
    cpaCodeAbbreviationFrench: 'APP'
  },
  613: {
    cpaCodeFullName: 'Student Loan',
    cpaCodeAbbreviationEnglish: 'PSL',
    cpaCodeAbbreviationFrench: 'PEP'
  },
  614: {
    cpaCodeFullName: 'Grant/Bursary',
    cpaCodeAbbreviationEnglish: 'PGB',
    cpaCodeAbbreviationFrench: 'SBP'
  },
  615: {
    cpaCodeFullName: 'Solidarity Tax Credit',
    cpaCodeAbbreviationEnglish: 'STC',
    cpaCodeAbbreviationFrench: 'CIS'
  },
  616: {
    cpaCodeFullName: 'Children Assistance',
    cpaCodeAbbreviationEnglish: 'CAS',
    cpaCodeAbbreviationFrench: 'SAE'
  },
  617: {
    cpaCodeFullName: 'Tax Refund',
    cpaCodeAbbreviationEnglish: 'TRX',
    cpaCodeAbbreviationFrench: 'IMP'
  }
} as const satisfies Record<CPACodeNumber, CPACode>;

const cpaTransactionCodesCommercial = {
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

const cpaTransactionCodes = {
  ...cpaTransactionCodesPreauthorized,
  ...cpaTransactionCodesFederal,
  ...cpaTransactionCodesProvincialLocal,
  ...cpaTransactionCodesCommercial
} as const satisfies Record<CPACodeNumber, CPACode>;

const frozenCPATransactionCodes = Object.freeze({ ...cpaTransactionCodes });

type CPATransactionCodeKey = keyof typeof cpaTransactionCodes;
/** Stringified literal union of every recognised CPA transaction code. */
export type CPATransactionCode = `${CPATransactionCodeKey}`;

export class CPATransactionCodes {
  /** All recognised CPA-005 transaction codes keyed by their numeric value. */
  static readonly all = frozenCPATransactionCodes;

  /** Type guard for whether a string is a recognised CPA transaction code. */
  static is(cpaCode: string): cpaCode is CPATransactionCode {
    return Object.hasOwn(frozenCPATransactionCodes, cpaCode);
  }
}
