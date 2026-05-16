# EFT Generator for Node

[![NPM Version](https://img.shields.io/npm/v/%40rationalthinker1%2Feft-generator)](https://www.npmjs.com/package/@rationalthinker1/eft-generator)

> Forked from [cityssm/node-eft-generator](https://github.com/cityssm/node-eft-generator).

Formats Electronic Funds Transfer (EFT) data into the CPA 005 standard.

Supports credit (C) and debit (D) record types.
Other logical record types are not supported.

✔️ Output parsed successfully by BMO.

## Installation

```sh
npm install @rationalthinker1/eft-generator
# or
yarn add @rationalthinker1/eft-generator
```

## Usage

```javascript
import fs from 'node:fs'
import { BankPADInformation, EFTFileBuilder } from '@rationalthinker1/eft-generator'

const { bankInstitution, bankTransit, bankAccount } = BankPADInformation

const eftFile = new EFTFileBuilder({
  originatorId: '0123456789',
  originatorShortName: 'SSM',
  originatorLongName: 'The City of Sault Ste. Marie',
  fileCreationNumber: '0001'
})

eftFile.addDebitTransaction({
  bankInstitutionNumber: bankInstitution('003'), // RBC
  bankTransitNumber: bankTransit('22222'),
  bankAccountNumber: bankAccount('333333333'),
  cpaCode: '385', // Property Taxes
  amount: 1234.56,
  payeeName: 'Test Property Owner'
})

// `generate()` runs the strict validator first; any spec violation
// throws before any output is written.
const { output, lines } = eftFile.generate()

fs.writeFileSync('cpa005.txt', output)
```

`output` is the CPA-005 string. `lines` is a per-record breakdown — one
entry per logical record (header, each transaction, trailer). Each entry
maps every `@Field`-decorated property to `{ before, after }`, where
`before` is the raw instance value coerced to a string and `after` is
the on-the-wire value rendered for that field. A transaction entry is a
flat array of its segments' field-value records.

The validator can also be invoked directly:

```javascript
eftFile.validate() // returns void; throws on any violation
```

## Resources

- [Canadian Payments Association Standard 005](https://www.payments.ca/sites/default/files/standard005eng.pdf)
- [Royal Bank CPA-005 Reference](docs/rbc-cpa-005-reference.pdf) ([RBC source](https://www.rbcroyalbank.com/ach/file-451771.pdf))
- [BMO Electronic Funds Transfer Client Manual](docs/bmo-cpa-005-reference.pdf)

## Related Projects

[CPA Codes for Node](https://github.com/cityssm/node-cpa-codes)<br />
Lookups, validations, and utility functions for Canadian Payments Association (CPA) Standard 007 transaction and return codes.
