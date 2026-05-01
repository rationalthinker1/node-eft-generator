import type { CPACode, CPACodeNumber } from '#types';

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
    cpaCodeFullName: 'Canadian Dairy Commission',
    cpaCodeAbbreviationEnglish: 'CDC',
    cpaCodeAbbreviationFrench: 'CCL'
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
    cpaCodeFullName: 'Canadian Pension Commission',
    cpaCodeAbbreviationEnglish: 'CPC',
    cpaCodeAbbreviationFrench: 'CCP'
  },
  314: {
    cpaCodeFullName: 'Family Allowances',
    cpaCodeAbbreviationEnglish: 'FAL',
    cpaCodeAbbreviationFrench: 'AFA'
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
    cpaCodeFullName: 'Dbt CCRA Government of Canada',
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
    cpaCodeFullName: 'Canada Savings Plan',
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
    cpaCodeFullName: 'Provincial Family Benefits',
    cpaCodeAbbreviationEnglish: 'PFB',
    cpaCodeAbbreviationFrench: 'PFA'
  },
  605: {
    cpaCodeFullName: 'Combined Fed-Prov/Terr Payment',
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
    cpaCodeFullName: 'Provincial Health Care Premium',
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

const cpaTransactionCodesInterFI = {
  650: {
    cpaCodeFullName: 'Inter-FI Funds Transfer Debit',
    cpaCodeAbbreviationEnglish: 'IFD',
    cpaCodeAbbreviationFrench: 'DIF'
  }
} as const satisfies Record<CPACodeNumber, CPACode>;

const cpaTransactionCodesCommercial = {
  700: {
    cpaCodeFullName: 'Business PAD',
    cpaCodeAbbreviationEnglish: 'BPD',
    cpaCodeAbbreviationFrench: 'DPA'
  },
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
  ...cpaTransactionCodesInterFI,
  ...cpaTransactionCodesCommercial
} as const satisfies Record<CPACodeNumber, CPACode>;

const frozenCPATransactionCodes = Object.freeze({ ...cpaTransactionCodes });

type CPATransactionCodeKey = keyof typeof cpaTransactionCodes;
/** Stringified literal union of every recognised CPA transaction code. */
export type CPATransactionCode = `${CPATransactionCodeKey}`;

export class CPATransactionCodes {
  /** All recognised CPA-005 transaction codes keyed by their numeric value. */
  static readonly all = frozenCPATransactionCodes;

  static readonly PAYROLL_DEPOSIT = '200';
  static readonly SPECIAL_PAYROLL = '201';
  static readonly VACATION_PAYROLL = '202';
  static readonly OVERTIME_PAYROLL = '203';
  static readonly ADVANCE_PAYROLL = '204';
  static readonly COMMISSION_PAYROLL = '205';
  static readonly BONUS_PAYROLL = '206';
  static readonly ADJUSTMENT_PAYROLL = '207';
  static readonly PENSION = '230';
  static readonly FEDERAL_PENSION = '231';
  static readonly PROVINCIAL_PENSION = '232';
  static readonly PRIVATE_PENSION = '233';
  static readonly ANNUITY = '240';
  static readonly DIVIDEND = '250';
  static readonly COMMON_DIVIDEND = '251';
  static readonly PREFERRED_DIVIDEND = '252';
  static readonly INVESTMENT = '260';
  static readonly MUTUAL_FUNDS = '261';
  static readonly SPOUSAL_RSP_CONTRIBUTION = '265';
  static readonly RESP_CONTRIBUTION = '266';
  static readonly RSP_CONTRIBUTION = '271';
  static readonly RETIREMENT_INCOME_FUND = '272';
  static readonly TAX_FREE_SAVINGS_ACCOUNT = '273';
  static readonly RDSP_CONTRIBUTION = '274';
  static readonly INTEREST = '280';
  static readonly LOTTERY_PRIZE_PAYMENT = '281';
  static readonly INSURANCE = '330';
  static readonly LIFE_INSURANCE = '331';
  static readonly AUTO_INSURANCE = '332';
  static readonly PROPERTY_INSURANCE = '333';
  static readonly CASUALTY_INSURANCE = '334';
  static readonly MORTGAGE_INSURANCE = '335';
  static readonly HEALTH_DENTAL_CLAIM_INSURANCE = '336';
  static readonly LOAN = '350';
  static readonly PERSONAL_LOAN = '351';
  static readonly DEALER_PLAN_LOAN = '352';
  static readonly FARM_IMPROVEMENT_LOAN = '353';
  static readonly HOME_IMPROVEMENT_LOAN = '354';
  static readonly TERM_LOAN = '355';
  static readonly INSURANCE_LOAN = '356';
  static readonly MORTGAGE = '370';
  static readonly RESIDENTIAL_MORTGAGE = '371';
  static readonly PREAUTHORIZED_COMMERCIAL_MORTGAGE = '372';
  static readonly FARM_MORTGAGE = '373';
  static readonly TAX = '380';
  static readonly INCOME_TAX = '381';
  static readonly SALES_TAX = '382';
  static readonly CORPORATE_TAX = '383';
  static readonly SCHOOL_TAX = '384';
  static readonly PROPERTY_TAX = '385';
  static readonly WATER_TAX = '386';
  static readonly RENT = '400';
  static readonly RESIDENTIAL_RENT = '401';
  static readonly PREAUTHORIZED_COMMERCIAL_RENT = '402';
  static readonly EQUIPMENT_RENT = '403';
  static readonly AUTOMOBILE_RENT = '404';
  static readonly APPLIANCE_RENT = '405';
  static readonly CASH_MANAGEMENT = '420';
  static readonly BILL_PAYMENT = '430';
  static readonly TELEPHONE_BILL = '431';
  static readonly GASOLINE_BILL = '432';
  static readonly HYDRO_BILL = '433';
  static readonly CABLE_BILL = '434';
  static readonly FUEL_BILL = '435';
  static readonly UTILITY_BILL = '436';
  static readonly INTERNET_ACCESS = '437';
  static readonly WATER_BILL = '438';
  static readonly AUTO_PAYMENT = '439';
  static readonly MISC_PAYMENT = '450';
  static readonly CUSTOMER_CHEQUE = '451';
  static readonly EXPENSE_PAYMENT = '452';
  static readonly BILL_PAYMENT_ERROR_CORRECTION = '453';
  static readonly ACCOUNTS_PAYABLE = '460';
  static readonly FEE = '470';
  static readonly DONATION = '480';

  static readonly FEDERAL_PAYMENT = '300';
  static readonly AGRI_STABILIZATION = '301';
  static readonly CANADIAN_DAIRY_COMMISSION = '302';
  static readonly HRDC_TRAINING = '303';
  static readonly CANADA_CHILD_BENEFIT = '308';
  static readonly GST = '309';
  static readonly CPP = '310';
  static readonly OLD_AGE_SECURITY = '311';
  static readonly WAR_VETERANS_ALLOWANCE = '312';
  static readonly CANADIAN_PENSION_COMMISSION = '313';
  static readonly FAMILY_ALLOWANCES = '314';
  static readonly PS_SUPERANNUATION = '315';
  static readonly CF_SUPERANNUATION = '316';
  static readonly FEDERAL_TAX_REFUND = '317';
  static readonly EI = '318';
  static readonly CCRA_DEBIT = '319';
  static readonly FEDERAL_STUDENT_LOAN = '320';
  static readonly CSB_INTEREST = '321';
  static readonly EXTERNAL_AFFAIRS = '322';
  static readonly CANADA_SAVINGS_PLAN = '323';
  static readonly ACCESS_GRANT = '324';
  static readonly CANADA_CARBON_REBATE = '325';

  static readonly PROVINCIAL_LOCAL_GOVERNMENT_PAYMENT = '600';
  static readonly FAMILY_SUPPORT_PLAN = '601';
  static readonly HOUSING_ALLOWANCE = '602';
  static readonly INCOME_SECURITY_BENEFIT = '603';
  static readonly PROVINCIAL_FAMILY_BENEFITS = '604';
  static readonly FED_PROV_TERR_PAYMENT = '605';
  static readonly WORKERS_COMPENSATION_BOARD = '606';
  static readonly EMPLOYMENT_ASSISTANCE_ALLOWANCE = '607';
  static readonly AUTOMOBILE_INSURANCE_PLAN = '608';
  static readonly PROVINCIAL_HEALTH_CARE_PREMIUM = '609';
  static readonly OFFENCES_AND_FINES = '610';
  static readonly DISABILITY_PAYMENT = '611';
  static readonly PARENTAL_INSURANCE = '612';
  static readonly PROVINCIAL_STUDENT_LOAN = '613';
  static readonly GRANT_BURSARY = '614';
  static readonly SOLIDARITY_TAX_CREDIT = '615';
  static readonly CHILDREN_ASSISTANCE = '616';
  static readonly PROVINCIAL_TAX_REFUND = '617';

  static readonly INTER_FI_FUNDS_TRANSFER_DEBIT = '650';

  static readonly BUSINESS_PAD = '700';
  static readonly COMMERCIAL_INVESTMENT = '701';
  static readonly COMMERCIAL_INSURANCE = '702';
  static readonly COMMERCIAL_AUTO_INSURANCE = '703';
  static readonly COMMERCIAL_PROPERTY_INSURANCE = '704';
  static readonly COMMERCIAL_CASUALTY_INSURANCE = '705';
  static readonly COMMERCIAL_MORTGAGE_INSURANCE = '706';
  static readonly COMMERCIAL_LOAN = '707';
  static readonly COMMERCIAL_MORTGAGE = '708';
  static readonly COMMERCIAL_TAX = '709';
  static readonly COMMERCIAL_INCOME_TAX = '710';
  static readonly COMMERCIAL_SALES_TAX = '711';
  static readonly COMMERCIAL_GST = '712';
  static readonly COMMERCIAL_PROPERTY_TAX = '713';
  static readonly COMMERCIAL_RENT = '714';
  static readonly COMMERCIAL_EQUIPMENT_RENT = '715';
  static readonly COMMERCIAL_AUTOMOBILE_RENT = '716';
  static readonly COMMERCIAL_CASH_MANAGEMENT = '717';
  static readonly COMMERCIAL_BILL_PAYMENT = '718';
  static readonly COMMERCIAL_TELEPHONE_BILL = '719';
  static readonly COMMERCIAL_GASOLINE_BILL = '720';
  static readonly COMMERCIAL_HYDRO_BILL = '721';
  static readonly COMMERCIAL_CABLE_BILL = '722';
  static readonly COMMERCIAL_FUEL_BILL = '723';
  static readonly COMMERCIAL_UTILITY_BILL = '724';
  static readonly COMMERCIAL_INTERNET_BILL = '725';
  static readonly COMMERCIAL_WATER_BILL = '726';
  static readonly COMMERCIAL_AUTO_PAYMENT = '727';
  static readonly COMMERCIAL_EXPENSE_PAYMENT = '728';
  static readonly COMMERCIAL_ACCOUNTS_PAYABLE = '729';
  static readonly COMMERCIAL_FEE = '730';
  static readonly COMMERCIAL_CREDITOR_INSURANCE = '731';

  /** Type guard for whether a string is a recognised CPA transaction code. */
  static is(cpaCode: string): cpaCode is CPATransactionCode {
    return Object.hasOwn(frozenCPATransactionCodes, cpaCode);
  }
}
