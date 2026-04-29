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
import { EFTFileBuilder } from '@rationalthinker1/eft-generator'

const eftFile = new EFTFileBuilder({
  originatorId: '0123456789',
  originatorShortName: 'SSM',
  originatorLongName: 'The City of Sault Ste. Marie',
  fileCreationNumber: '0001'
})

eftFile.addDebitTransaction({
  bankInstitutionNumber: '111',
  bankTransitNumber: '22222',
  bankAccountNumber: '333333333',
  cpaCode: 385, // Property Taxes
  amount: 1234.56,
  payeeName: 'Test Property Owner'
})

const output = eftFile.generate()

fs.writeFileSync('cpa005.txt', output)
```

## Migrating from 1.x to 2.x

The top-level class was renamed from `EFTGenerator` to `EFTFileBuilder` to make
room for an internal `EFTGenerator` class that owns CPA-005 formatting. Two
methods on the public class were also renamed for clarity:

```diff
- import { EFTGenerator } from '@rationalthinker1/eft-generator'
- const eft = new EFTGenerator(config)
+ import { EFTFileBuilder } from '@rationalthinker1/eft-generator'
+ const eft = new EFTFileBuilder(config)

- eft.toCPA005()
- eft.validateCPA005()
+ eft.generate()
+ eft.validate()
```

`addTransaction`, `addCreditTransaction`, `addDebitTransaction`,
`getConfiguration`, and `getTransactions` are unchanged.

## Resources

- [Canadian Payments Association Standard 005](https://www.payments.ca/sites/default/files/standard005eng.pdf)
- [Royal Bank CPA-005 Reference](https://www.rbcroyalbank.com/ach/file-451771.pdf)

## Related Projects

[CPA Codes for Node](https://github.com/cityssm/node-cpa-codes)<br />
Lookups, validations, and utility functions for Canadian Payments Association (CPA) Standard 007 transaction and return codes.
