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
const output = eftFile.generate()

fs.writeFileSync('cpa005.txt', output)
```

The validator can also be invoked directly:

```javascript
eftFile.validate() // returns void; throws on any violation
```

## Migrating from 2.x to 3.x

- Digit fields (`bankInstitutionNumber`, `bankTransitNumber`, `bankAccountNumber`,
  and the `return*Number` config fields) are now branded types. Construct them
  via `BankPADInformation.bankInstitution(...)`, `.bankTransit(...)`,
  `.bankAccount(...)`. Bank institution numbers are validated against the
  Payments Canada FI list.
- `cpaCode` is the literal string union `CPATransactionCode`; only known codes
  type-check.

## Migrating from 3.x to 4.x

- `EFTFileBuilder.validate()` now returns `void` and throws on any spec
  violation. Catch the thrown `Error` if you need a boolean.
- The validator is strict: prohibited characters, oversized names, duplicate
  cross-reference numbers, empty transactions, segments-per-record overflow,
  and out-of-range payment dates (more than 173 days from `fileCreationDate`)
  all throw instead of warn.
- `originatorShortName` is no longer auto-defaulted to `originatorLongName`.

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
- [Royal Bank CPA-005 Reference](docs/rbc-cpa-005-reference.pdf) ([RBC source](https://www.rbcroyalbank.com/ach/file-451771.pdf))
- [BMO Electronic Funds Transfer Client Manual](docs/bmo-cpa-005-reference.pdf)

## Related Projects

[CPA Codes for Node](https://github.com/cityssm/node-cpa-codes)<br />
Lookups, validations, and utility functions for Canadian Payments Association (CPA) Standard 007 transaction and return codes.
