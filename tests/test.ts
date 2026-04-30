import assert from 'node:assert';
import fs from 'node:fs';
import { describe, it, mock } from 'node:test';

import { BankPADInformation, EFTFileBuilder, EFTFileValidator } from '#index';
import { RECORD_TYPE, TRANSACTION_TYPE, type EFTConfiguration } from '#domain/types';
import type { CPATransactionCode } from '#domain/CPACodes';
import { NEWLINE as cpa005_newline } from '#utils/index';

const { bankAccount, bankInstitution, bankTransit } = BankPADInformation;

const config: EFTConfiguration = {
  originatorId: '0123456789',
  originatorLongName: 'The City of Sault Ste. Marie',
  originatorShortName: 'SSM',
  fileCreationNumber: '0001',
  destinationCurrency: 'CAD',
  destinationDataCentre: '123',

  returnInstitutionNumber: bankInstitution('003'),
  returnTransitNumber: bankTransit('22222'),
  returnAccountNumber: bankAccount('333333333333')
};

const cpaCodePropertyTaxes: CPATransactionCode = '385';

const validBank = {
  bankInstitutionNumber: bankInstitution('003'),
  bankTransitNumber: bankTransit('22222'),
  bankAccountNumber: bankAccount('333333333'),
  paymentDate: new Date()
};

await describe('eft-generator - CPA-005', async () => {
  await it('Creates valid CPA-005 formatted output', () => {
    const eftGenerator = new EFTFileBuilder(config);

    assert.strictEqual(eftGenerator.getTransactions().length, 0);

    eftGenerator.addTransaction({
      recordType: TRANSACTION_TYPE.DEBIT,
      segments: [
        {
          ...validBank,
          cpaCode: cpaCodePropertyTaxes,
          amount: 1234.56,
          payeeName: 'Test Property Owner'
        },
        {
          bankInstitutionNumber: bankInstitution('004'),
          bankTransitNumber: bankTransit('33333'),
          bankAccountNumber: bankAccount('4444444444'),
          cpaCode: cpaCodePropertyTaxes,
          amount: 2345.67,
          payeeName: 'Test Property Owner 2',
          paymentDate: new Date()
        }
      ]
    });

    assert.strictEqual(eftGenerator.getTransactions().length, 1);

    eftGenerator.addTransaction({
      recordType: TRANSACTION_TYPE.CREDIT,
      segments: [
        {
          ...validBank,
          cpaCode: cpaCodePropertyTaxes,
          amount: 1234.56,
          payeeName: 'Test Property Owner'
        },
        {
          bankInstitutionNumber: bankInstitution('004'),
          bankTransitNumber: bankTransit('33333'),
          bankAccountNumber: bankAccount('4444444444'),
          cpaCode: cpaCodePropertyTaxes,
          amount: 2345.67,
          payeeName: 'Test Property Owner 2',
          paymentDate: new Date()
        }
      ]
    });

    assert.strictEqual(eftGenerator.getTransactions().length, 2);

    assert.doesNotThrow(() => {
      eftGenerator.validate();
    });

    const output = eftGenerator.generate();

    fs.writeFileSync('tests/output/cpa005.txt', output);

    assert.ok(output.length > 0);
    assert.strictEqual(output.charAt(0), 'A');

    const outputLines = output.split(cpa005_newline);

    for (const outputLine of outputLines) {
      assert.strictEqual(outputLine.length, 1464);
    }
  });

  await describe('Configuration validation', async () => {
    await it('throws when originatorId length is too long', () => {
      const eftGenerator = new EFTFileBuilder({
        originatorId: '12345678901234567890',
        originatorShortName: 'X',
        originatorLongName: '',
        fileCreationNumber: '0001',
        destinationDataCentre: '123'
      });
      assert.throws(() => {
        eftGenerator.generate();
      });
    });

    await it('throws when fileCreationNumber is invalid', () => {
      const eftGenerator = new EFTFileBuilder({
        originatorId: '1',
        originatorShortName: 'X',
        originatorLongName: '',
        fileCreationNumber: 'abcdefg',
        destinationDataCentre: '123'
      });
      assert.throws(() => {
        eftGenerator.generate();
      });
    });

    await it('throws when destinationDataCentre is invalid', () => {
      const eftGenerator = new EFTFileBuilder({
        originatorId: '1',
        originatorShortName: 'X',
        originatorLongName: 'Name',
        fileCreationNumber: '1234',
        destinationDataCentre: '1234567'
      });
      assert.throws(() => {
        eftGenerator.generate();
      });
    });

    await it('throws when destinationCurrency is invalid', () => {
      const eftGenerator = new EFTFileBuilder({
        originatorId: '1',
        originatorShortName: 'X',
        originatorLongName: 'Name',
        fileCreationNumber: '1234',
        // @ts-expect-error - intentionally invalid to verify validation
        destinationCurrency: 'AUD'
      });
      assert.throws(() => {
        eftGenerator.validate();
      });
    });
  });

  await describe('Brand constructors', async () => {
    await it('bankInstitution throws on values not in the recognised FI set', () => {
      assert.throws(() => bankInstitution('1'));
      assert.throws(() => bankInstitution('12'));
      assert.throws(() => bankInstitution('1234'));
      assert.throws(() => bankInstitution('abc'));
      assert.throws(() => bankInstitution('a1b'));
      assert.throws(() => bankInstitution('111'));
      assert.throws(() => bankInstitution('999'));
    });

    await it('bankInstitution accepts known Canadian FI codes', () => {
      assert.strictEqual(bankInstitution('001'), '001'); // BMO
      assert.strictEqual(bankInstitution('003'), '003'); // RBC
      assert.strictEqual(bankInstitution('010'), '010'); // CIBC
    });

    await it('bankTransit throws unless the value is exactly 5 digits', () => {
      assert.throws(() => bankTransit('1'));
      assert.throws(() => bankTransit('1234'));
      assert.throws(() => bankTransit('123456'));
      assert.throws(() => bankTransit('abcde'));
    });

    await it('bankAccount throws on values shorter than 5 or longer than 12', () => {
      assert.throws(() => bankAccount('1'));
      assert.throws(() => bankAccount('1234'));
      assert.throws(() => bankAccount('1234567890123'));
      assert.throws(() => bankAccount('abcd1234'));
    });

    await it('bankAccount accepts 5- to 12-digit numerics', () => {
      assert.strictEqual(bankAccount('12345'), '12345');
      assert.strictEqual(bankAccount('123456789012'), '123456789012');
    });
  });

  await describe('Transaction validation', async () => {
    await it('throws when recordType is unsupported', () => {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addTransaction({
        // @ts-expect-error - intentionally invalid to verify validation
        recordType: 'E',
        segments: [
          {
            ...validBank,
            payeeName: 'Invalid Institution',
            amount: 100,
            cpaCode: cpaCodePropertyTaxes
          }
        ]
      });
      assert.throws(() => {
        eftGenerator.generate();
      });
    });

    await it('throws when there are no transactions in the file', () => {
      const eftGenerator = new EFTFileBuilder(config);
      assert.throws(() => {
        eftGenerator.generate();
      }, /no transactions/i);
    });

    await it('throws when a transaction has no segments', () => {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addTransaction({
        recordType: TRANSACTION_TYPE.DEBIT,
        segments: []
      });
      assert.throws(() => {
        eftGenerator.generate();
      }, /no segments/);
    });

    await it('throws when a transaction has more than six segments', () => {
      const eftGenerator = new EFTFileBuilder(config);
      const segment = {
        ...validBank,
        bankAccountNumber: bankAccount('3333333'),
        cpaCode: cpaCodePropertyTaxes,
        payeeName: 'Test Property Owner'
      } as const;
      eftGenerator.addTransaction({
        recordType: TRANSACTION_TYPE.DEBIT,
        segments: [
          { ...segment, amount: 100.01 },
          { ...segment, amount: 100.02 },
          { ...segment, amount: 100.03 },
          { ...segment, amount: 100.04 },
          { ...segment, amount: 100.05 },
          { ...segment, amount: 100.06 },
          { ...segment, amount: 100.07 }
        ]
      });
      assert.throws(() => {
        eftGenerator.generate();
      }, /more than 6 segments/);
    });

    await it('throws when a transaction has a negative amount', () => {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addDebitTransaction({
        ...validBank,
        payeeName: 'Negative Amount',
        amount: -2,
        cpaCode: cpaCodePropertyTaxes
      });
      assert.throws(() => {
        eftGenerator.generate();
      });
    });

    await it('throws when a transaction amount is too large', () => {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addDebitTransaction({
        ...validBank,
        payeeName: 'Large Amount',
        amount: 999_999_999,
        cpaCode: cpaCodePropertyTaxes
      });
      assert.throws(() => {
        eftGenerator.generate();
      });
    });

    await it('throws when payeeName exceeds 30 characters', () => {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addCreditTransaction({
        ...validBank,
        payeeName: 'This payee name is too long and will be truncated to fit.',
        amount: 100,
        cpaCode: cpaCodePropertyTaxes
      });
      assert.throws(() => {
        eftGenerator.generate();
      }, /payeeName exceeds/);
    });

    await it('throws on duplicate crossReferenceNumber within the same file', () => {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addDebitTransaction({
        ...validBank,
        payeeName: 'first',
        crossReferenceNumber: 'abc',
        amount: 100,
        cpaCode: cpaCodePropertyTaxes
      });
      eftGenerator.addDebitTransaction({
        ...validBank,
        payeeName: 'second',
        crossReferenceNumber: 'abc',
        amount: 100,
        cpaCode: cpaCodePropertyTaxes
      });
      assert.throws(() => {
        eftGenerator.generate();
      }, /crossReferenceNumber must be unique/);
    });

    await it('throws when paymentDate is more than 173 days from fileCreationDate', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        fileCreationDate: new Date(2025, 0, 1)
      });
      eftGenerator.addDebitTransaction({
        ...validBank,
        payeeName: 'too far',
        amount: 100,
        cpaCode: cpaCodePropertyTaxes,
        paymentDate: new Date(2025, 11, 1) // ~334 days later
      });
      assert.throws(() => {
        eftGenerator.generate();
      }, /paymentDate is more than 173 days/);
    });
  });

  await describe('Spec compliance', async () => {
    await it('Uses CR-only as line delimiter, not CRLF (spec page 58)', () => {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE'
      });

      const output = eftGenerator.generate();

      assert.ok(!output.includes('\n'), 'output must not contain LF (0x0A)');
      assert.ok(output.includes('\r'), 'output must use CR (0x0D) as delimiter');
    });

    await it('Output contains only spec-allowed characters (spec page 59)', () => {
      // Names that contain prohibited characters; these will throw at validation.
      const eftGenerator = new EFTFileBuilder({
        ...config,
        originatorShortName: 'TEST GAME PLAN',
        originatorLongName: 'TOTAL GAME PLAN INC'
      });
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE'
      });

      const output = eftGenerator.generate();

      // Allowed: 0-9, A-Z, blank, = _ $ . & * , plus CR record delimiter
      assert.match(output, /^[0-9A-Z =_$.&*,\r]*$/);
    });

    await it('throws when originatorShortName contains prohibited characters', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        originatorShortName: 'TH(855)515-9999'
      });
      assert.throws(
        () => new EFTFileValidator(eftGenerator).validate(),
        /originatorShortName contains prohibited characters/
      );
    });

    await it('throws when originatorLongName contains prohibited characters', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        originatorLongName: 'Total Game Plan 1(855)515-9999'
      });
      assert.throws(
        () => new EFTFileValidator(eftGenerator).validate(),
        /originatorLongName contains prohibited characters/
      );
    });

    await it('throws when originatorId contains prohibited characters (spec page 59)', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        originatorId: 'CO(123)'
      });
      assert.throws(
        () => new EFTFileValidator(eftGenerator).validate(),
        /originatorId contains prohibited characters/
      );
    });

    await it('warns and sanitizes when payeeName contains prohibited characters (spec page 59)', () => {
      // Real-world payee names commonly contain hyphens and apostrophes
      // that the spec prohibits; payeeName is the only field that warns
      // rather than throws. See EFTFileValidator class doc.
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'ELISSA GOLDSTEIN-KRUPSKI'
      });

      const warnings: string[] = [];
      const warnSpy = mock.method(console, 'warn', (...args: unknown[]) => {
        warnings.push(args.map(String).join(' '));
      });

      let output = '';
      try {
        output = eftGenerator.generate();
      } finally {
        warnSpy.mock.restore();
      }

      assert.ok(
        warnings.some((w) => /payeeName contains prohibited characters/.test(w)),
        `expected warning, got ${JSON.stringify(warnings)}`
      );
      assert.match(output, /^[0-9A-Z =_$.&*,\r]*$/);
    });

    await it('throws when crossReferenceNumber contains prohibited characters (spec page 59)', () => {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE',
        crossReferenceNumber: 'REF-12345(A)'
      });
      assert.throws(
        () => new EFTFileValidator(eftGenerator).validate(),
        /crossReferenceNumber contains prohibited characters/
      );
    });
  });

  await describe('Spec field positions', async () => {
    function buildSampleOutput(): string {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addCreditTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE'
      });
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 200,
        payeeName: 'TEST PAYOR'
      });
      return eftGenerator.generate();
    }

    await it('C record field 13 (positions 165-174) is 10 blanks (spec page 60)', () => {
      const lines = buildSampleOutput().split('\r');
      const cRecord =
        lines.find((line) => line.startsWith(RECORD_TYPE.TRANSACTION_CREDIT)) ?? '';
      assert.ok(cRecord, 'expected at least one C record');
      assert.strictEqual(cRecord.slice(164, 174), ' '.repeat(10));
    });

    await it('D record field 13 (positions 165-174) is 10 blanks (spec page 63)', () => {
      const lines = buildSampleOutput().split('\r');
      const dRecord =
        lines.find((line) => line.startsWith(RECORD_TYPE.TRANSACTION_DEBIT)) ?? '';
      assert.ok(dRecord, 'expected at least one D record');
      assert.strictEqual(dRecord.slice(164, 174), ' '.repeat(10));
    });

    await it('D record positions 215-247 are 33 zeros (spec page 64)', () => {
      const lines = buildSampleOutput().split('\r');
      const dRecord =
        lines.find((line) => line.startsWith(RECORD_TYPE.TRANSACTION_DEBIT)) ?? '';
      assert.ok(dRecord);
      assert.strictEqual(dRecord.slice(214, 247), '0'.repeat(33));
    });

    await it('Trailer positions 69-1464 are 1396 blanks (spec page 64)', () => {
      const lines = buildSampleOutput().split('\r');
      const trailer = lines.find((line) => line.startsWith(RECORD_TYPE.TRAILER)) ?? '';
      assert.ok(trailer);
      assert.strictEqual(trailer.slice(68), ' '.repeat(1396));
    });
  });

  await describe('validateFile', async () => {
    function builderWithOneTransaction(): EFTFileBuilder {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE'
      });
      return eftGenerator;
    }

    function validatorFor(builder: EFTFileBuilder): EFTFileValidator {
      return new EFTFileValidator(builder);
    }

    await it('throws on empty output', () => {
      assert.throws(
        () => validatorFor(builderWithOneTransaction()).validateFile(''),
        /output is empty/
      );
    });

    await it('throws when output contains LF', () => {
      const valid = builderWithOneTransaction().generate();
      const tampered = valid.replace('\r', '\r\n');
      assert.throws(
        () => validatorFor(builderWithOneTransaction()).validateFile(tampered),
        /contains LF/
      );
    });

    await it('throws when fewer than 3 records', () => {
      // header + trailer only (no transaction).
      const headerOnlyBuilder = builderWithOneTransaction();
      const valid = headerOnlyBuilder.generate();
      const lines = valid.split('\r');
      const headerAndTrailer = [lines[0], lines.at(-1)].join('\r');
      assert.throws(
        () => validatorFor(headerOnlyBuilder).validateFile(headerAndTrailer),
        /requires at least 3/
      );
    });

    await it('passes when transaction record is exactly 1464 chars', () => {
      const builder = builderWithOneTransaction();
      const valid = builder.generate();
      const lines = valid.split('\r');
      assert.strictEqual((lines[1] ?? '').length, 1464);
      assert.doesNotThrow(() => {
        validatorFor(builder).validateFile(valid);
      });
    });

    await it('throws when transaction record is 1463 chars (one short)', () => {
      const valid = builderWithOneTransaction().generate();
      const lines = valid.split('\r');
      lines[1] = (lines[1] ?? '').slice(0, 1463);
      const tampered = lines.join('\r');
      assert.throws(
        () => validatorFor(builderWithOneTransaction()).validateFile(tampered),
        /record 2 length is 1463/
      );
    });

    await it('throws when transaction record is 1465 chars (one long)', () => {
      const valid = builderWithOneTransaction().generate();
      const lines = valid.split('\r');
      lines[1] = (lines[1] ?? '') + ' ';
      const tampered = lines.join('\r');
      assert.throws(
        () => validatorFor(builderWithOneTransaction()).validateFile(tampered),
        /record 2 length is 1465/
      );
    });

    await it('throws when a record is catastrophically truncated', () => {
      const valid = builderWithOneTransaction().generate();
      const lines = valid.split('\r');
      lines[1] = (lines[1] ?? '').slice(0, 100);
      const tampered = lines.join('\r');
      assert.throws(
        () => validatorFor(builderWithOneTransaction()).validateFile(tampered),
        /record 2 length is 100/
      );
    });

    await it('throws when a record contains a prohibited character', () => {
      const valid = builderWithOneTransaction().generate();
      const lines = valid.split('\r');
      // Replace one char in the transaction line with a lowercase letter.
      const original = lines[1] ?? '';
      lines[1] = 'x' + original.slice(1);
      const tampered = lines.join('\r');
      assert.throws(
        () => validatorFor(builderWithOneTransaction()).validateFile(tampered),
        /prohibited character "x"/
      );
    });

    await it('throws when first record is not the header', () => {
      const valid = builderWithOneTransaction().generate();
      const lines = valid.split('\r');
      // Swap the first character of the header from 'A' to 'X'.
      const header = lines[0] ?? '';
      lines[0] = 'X' + header.slice(1);
      const tampered = lines.join('\r');
      assert.throws(
        () => validatorFor(builderWithOneTransaction()).validateFile(tampered),
        /first record must start with 'A'/
      );
    });

    await it('throws when last record is not the trailer', () => {
      const valid = builderWithOneTransaction().generate();
      const lines = valid.split('\r');
      const trailer = lines.at(-1) ?? '';
      lines[lines.length - 1] = 'X' + trailer.slice(1);
      const tampered = lines.join('\r');
      assert.throws(
        () => validatorFor(builderWithOneTransaction()).validateFile(tampered),
        /last record must start with 'Z'/
      );
    });

    await it('throws when trailer record count does not match line count', () => {
      const valid = builderWithOneTransaction().generate();
      const lines = valid.split('\r');
      const trailer = lines.at(-1) ?? '';
      // Trailer record count field is at positions 2-10 (slice(1, 10)).
      // Replace it with a wrong count.
      lines[lines.length - 1] = trailer.charAt(0) + '999999999' + trailer.slice(10);
      const tampered = lines.join('\r');
      assert.throws(
        () => validatorFor(builderWithOneTransaction()).validateFile(tampered),
        /trailer record count is "999999999"/
      );
    });

    await it('passes for output produced by generate()', () => {
      const builder = builderWithOneTransaction();
      const output = builder.generate();
      assert.doesNotThrow(() => {
        validatorFor(builder).validateFile(output);
      });
    });
  });

  await describe('Julian date formatting', async () => {
    // Header positions 24-29 (0-indexed) are the file creation date in 0YYDDD format.
    function headerCreationDate(eftGenerator: EFTFileBuilder): string {
      return eftGenerator.generate().slice(24, 30);
    }

    await it('Formats January 1 as day 001', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        fileCreationDate: new Date(2022, 0, 1)
      });
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE',
        paymentDate: new Date(2022, 0, 1)
      });
      assert.strictEqual(headerCreationDate(eftGenerator), '022001');
    });

    await it('Formats December 31 of a non-leap year as day 365', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        fileCreationDate: new Date(2022, 11, 31)
      });
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE',
        paymentDate: new Date(2022, 11, 31)
      });
      assert.strictEqual(headerCreationDate(eftGenerator), '022365');
    });

    await it('Formats December 31 of a leap year as day 366', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        fileCreationDate: new Date(2020, 11, 31)
      });
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE',
        paymentDate: new Date(2020, 11, 31)
      });
      assert.strictEqual(headerCreationDate(eftGenerator), '020366');
    });

    await it('Pads single-digit YY to two digits', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        fileCreationDate: new Date(2005, 0, 5)
      });
      eftGenerator.addDebitTransaction({
        ...validBank,
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE',
        paymentDate: new Date(2005, 0, 5)
      });
      assert.strictEqual(headerCreationDate(eftGenerator), '005005');
    });
  });
});
