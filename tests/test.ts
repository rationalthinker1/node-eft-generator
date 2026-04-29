import assert from 'node:assert';
import fs from 'node:fs';
import { describe, it } from 'node:test';

import { EFTFileValidator } from '#EFTFileValidator';
import { EFTFileBuilder } from '#index';
import {
  RECORD_TYPE,
  TRANSACTION_TYPE,
  type EFTConfiguration
} from '#types';
import { NEWLINE as cpa005_newline } from '#utils';

const config: EFTConfiguration = {
  originatorId: '0123456789',
  originatorLongName: 'The City of Sault Ste. Marie',
  originatorShortName: 'SSM',
  fileCreationNumber: '0001',
  destinationCurrency: 'CAD',
  destinationDataCentre: '123',

  returnInstitutionNumber: '111',
  returnTransitNumber: '22222',
  returnAccountNumber: '333333333333'
};

const cpaCodePropertyTaxes = '385';

await describe('eft-generator - CPA-005', async () => {
  await it('Creates valid CPA-005 formatted output', () => {
    const eftGenerator = new EFTFileBuilder(config);

    assert.strictEqual(eftGenerator.getTransactions().length, 0);

    eftGenerator.addTransaction({
      recordType: TRANSACTION_TYPE.DEBIT,
      segments: [
        {
          bankInstitutionNumber: '111',
          bankTransitNumber: '22222',
          bankAccountNumber: '333333333',
          cpaCode: cpaCodePropertyTaxes,
          amount: 1234.56,
          payeeName: 'Test Property Owner'
        },
        {
          bankInstitutionNumber: '222',
          bankTransitNumber: '33333',
          bankAccountNumber: '4444444444',
          cpaCode: cpaCodePropertyTaxes,
          amount: 2345.67,
          payeeName: 'Test Property Owner 2'
        }
      ]
    });

    assert.strictEqual(eftGenerator.getTransactions().length, 1);

    eftGenerator.addTransaction({
      recordType: TRANSACTION_TYPE.CREDIT,
      segments: [
        {
          bankInstitutionNumber: '111',
          bankTransitNumber: '22222',
          bankAccountNumber: '333333333',
          cpaCode: cpaCodePropertyTaxes,
          amount: 1234.56,
          payeeName: 'Test Property Owner'
        },
        {
          bankInstitutionNumber: '222',
          bankTransitNumber: '33333',
          bankAccountNumber: '4444444444',
          cpaCode: cpaCodePropertyTaxes,
          amount: 2345.67,
          payeeName: 'Test Property Owner 2'
        }
      ]
    });

    assert.strictEqual(eftGenerator.getTransactions().length, 2);

    try {
      assert.ok(eftGenerator.validate());
    } catch (error) {
      console.log(error);
    }

    const output = eftGenerator.generate();

    fs.writeFileSync('tests/output/cpa005.txt', output);

    assert.ok(output.length > 0);
    assert.strictEqual(output.charAt(0), 'A');

    const outputLines = output.split(cpa005_newline);

    for (const outputLine of outputLines) {
      assert.strictEqual(outputLine.length, 1464);
    }
  });

  await describe('Configuration errors and warnings', async () => {
    await it('Throws error when originatorId length is too long.', () => {
      const eftGenerator = new EFTFileBuilder({
        originatorId: '12345678901234567890',
        originatorLongName: '',
        fileCreationNumber: '0001'
      });

      try {
        eftGenerator.generate();
        assert.fail();
      } catch {
        assert.ok(true);
      }
    });

    await it('Throws error when fileCreationNumber is invalid.', () => {
      const eftGenerator = new EFTFileBuilder({
        originatorId: '1',
        originatorLongName: '',
        fileCreationNumber: 'abcdefg'
      });

      try {
        eftGenerator.generate();
        assert.fail();
      } catch {
        assert.ok(true);
      }
    });

    await it('Throws error when destinationDataCentre is invalid.', () => {
      const eftGenerator = new EFTFileBuilder({
        originatorId: '1',
        originatorLongName: 'Name',
        fileCreationNumber: '1234',
        destinationDataCentre: '1234567'
      });

      try {
        eftGenerator.generate();
        assert.fail();
      } catch {
        assert.ok(true);
      }
    });

    await it('Throws error when destinationCurrency is invalid.', () => {
      const eftGenerator = new EFTFileBuilder({
        originatorId: '1',
        originatorLongName: 'Name',
        fileCreationNumber: '1234',
        // @ts-expect-error - intentionally invalid to verify validation
        destinationCurrency: 'AUD'
      });

      assert.ok(!eftGenerator.validate());
    });

    await it('Warns on missing originatorShortName', () => {
      const eftGenerator = new EFTFileBuilder({
        originatorId: '01',
        originatorLongName:
          'This name exceeds the 30 character limit and will be truncated.',
        fileCreationNumber: '0001'
      });

      assert.ok(
        new EFTFileValidator(eftGenerator).validate().some(
          (validationWarning) =>
            validationWarning.warningField === 'originatorShortName'
        )
      );
    });
  });

  await describe('Transaction errors and warnings', async () => {
    await it('Throws error when recordType is unsupported', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addTransaction({
        // @ts-expect-error - intentionally invalid to verify validation
        recordType: 'E',
        segments: [
          {
            payeeName: 'Invalid Institution',
            amount: 100,
            // @ts-expect-error - intentionally invalid to verify validation
            bankInstitutionNumber: 'abc',
            bankTransitNumber: '1',
            bankAccountNumber: '1',
            cpaCode: cpaCodePropertyTaxes
          }
        ]
      });

      try {
        eftGenerator.generate();
        assert.fail();
      } catch {
        assert.ok(true);
      }
    });

    await it('Warns when there are no segments on a transaction.', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addTransaction({
        recordType: TRANSACTION_TYPE.DEBIT,
        segments: []
      });

      const validationWarnings = new EFTFileValidator(eftGenerator).validate();

      assert.ok(
        validationWarnings.some(
          (validationWarning) => validationWarning.warningField === 'segments'
        )
      );

      const output = eftGenerator.generate();

      assert.ok(output.length > 0);
    });

    await it('Warns when there are more than six segments on a transaction.', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addTransaction({
        recordType: TRANSACTION_TYPE.DEBIT,
        segments: [
          {
            bankInstitutionNumber: '111',
            bankTransitNumber: '22222',
            bankAccountNumber: '3333333',
            cpaCode: cpaCodePropertyTaxes,
            amount: 100.01,
            payeeName: 'Test Property Owner'
          },
          {
            bankInstitutionNumber: '111',
            bankTransitNumber: '22222',
            bankAccountNumber: '3333333',
            cpaCode: cpaCodePropertyTaxes,
            amount: 100.02,
            payeeName: 'Test Property Owner'
          },
          {
            bankInstitutionNumber: '111',
            bankTransitNumber: '22222',
            bankAccountNumber: '3333333',
            cpaCode: cpaCodePropertyTaxes,
            amount: 100.03,
            payeeName: 'Test Property Owner'
          },
          {
            bankInstitutionNumber: '111',
            bankTransitNumber: '22222',
            bankAccountNumber: '3333333',
            cpaCode: cpaCodePropertyTaxes,
            amount: 100.04,
            payeeName: 'Test Property Owner'
          },
          {
            bankInstitutionNumber: '111',
            bankTransitNumber: '22222',
            bankAccountNumber: '3333333',
            cpaCode: cpaCodePropertyTaxes,
            amount: 100.05,
            payeeName: 'Test Property Owner'
          },
          {
            bankInstitutionNumber: '111',
            bankTransitNumber: '22222',
            bankAccountNumber: '3333333',
            cpaCode: cpaCodePropertyTaxes,
            amount: 100.06,
            payeeName: 'Test Property Owner'
          },
          {
            bankInstitutionNumber: '111',
            bankTransitNumber: '22222',
            bankAccountNumber: '3333333',
            cpaCode: cpaCodePropertyTaxes,
            amount: 100.07,
            payeeName: 'Test Property Owner'
          }
        ]
      });

      const validationWarnings = new EFTFileValidator(eftGenerator).validate();

      assert.ok(
        validationWarnings.some(
          (validationWarning) => validationWarning.warningField === 'segments'
        )
      );

      const output = eftGenerator.generate();

      assert.ok(output.length > 0);
    });

    await it('Throws error when a transaction has a negative amount.', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addDebitTransaction({
        payeeName: 'Negative Amount',
        amount: -2,
        bankInstitutionNumber: '1',
        bankTransitNumber: '1',
        bankAccountNumber: '1',
        cpaCode: '1'
      });

      try {
        eftGenerator.generate();
        assert.fail();
      } catch {
        assert.ok(true);
      }
    });

    await it('Throws error when a transaction has too large of an amount', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addDebitTransaction({
        payeeName: 'Large Amount',
        amount: 999_999_999,
        bankInstitutionNumber: '1',
        bankTransitNumber: '1',
        bankAccountNumber: '1',
        cpaCode: cpaCodePropertyTaxes
      });

      try {
        eftGenerator.generate();
        assert.fail();
      } catch {
        assert.ok(true);
      }
    });

    await it('Throws error when bankInstitutionNumber is invalid', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addDebitTransaction({
        payeeName: 'Invalid Institution',
        amount: 100,
        // @ts-expect-error - intentionally invalid to verify validation
        bankInstitutionNumber: 'abc',
        bankTransitNumber: '1',
        bankAccountNumber: '1',
        cpaCode: cpaCodePropertyTaxes
      });

      try {
        eftGenerator.generate();
        assert.fail();
      } catch {
        assert.ok(true);
      }
    });

    await it('Throws error when bankTransitNumber is invalid', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addDebitTransaction({
        payeeName: 'Invalid Transit',
        amount: 100,
        bankInstitutionNumber: '1',
        bankTransitNumber: '1234567',
        bankAccountNumber: '1',
        cpaCode: cpaCodePropertyTaxes
      });

      try {
        eftGenerator.generate();
        assert.fail();
      } catch {
        assert.ok(true);
      }
    });

    await it('Throws error when bankAccountNumber is invalid', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addDebitTransaction({
        payeeName: 'Invalid Account',
        amount: 100,
        bankInstitutionNumber: '1',
        bankTransitNumber: '1',
        // @ts-expect-error - intentionally invalid to verify validation
        bankAccountNumber: 'abcd',
        cpaCode: cpaCodePropertyTaxes
      });

      try {
        eftGenerator.generate();
        assert.fail();
      } catch {
        assert.ok(true);
      }
    });

    await it('Warns when the payeeName is too long.', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addCreditTransaction({
        payeeName: 'This payee name is too long and will be truncated to fit.',
        amount: 100,
        bankInstitutionNumber: '1',
        bankTransitNumber: '1',
        bankAccountNumber: '1',
        cpaCode: cpaCodePropertyTaxes
      });

      assert.ok(
        new EFTFileValidator(eftGenerator).validate().some(
          (validationWarning) => validationWarning.warningField === 'payeeName'
        )
      );
    });

    await it('Warns when the crossReferenceNumber is duplicated.', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addDebitTransaction({
        payeeName: 'Same cross reference',
        crossReferenceNumber: 'abc',
        amount: 100,
        bankInstitutionNumber: '1',
        bankTransitNumber: '1',
        bankAccountNumber: '1',
        cpaCode: cpaCodePropertyTaxes
      });

      eftGenerator.addDebitTransaction({
        payeeName: 'Same cross reference',
        crossReferenceNumber: 'abc',
        amount: 100,
        bankInstitutionNumber: '1',
        bankTransitNumber: '1',
        bankAccountNumber: '1',
        cpaCode: cpaCodePropertyTaxes
      });

      assert.ok(
        new EFTFileValidator(eftGenerator).validate().some(
          (validationWarning) =>
            validationWarning.warningField === 'crossReferenceNumber'
        )
      );
    });
  });

  await describe('Spec compliance', async () => {
    await it('Uses CR-only as line delimiter, not CRLF (spec page 58)', () => {
      const eftGenerator = new EFTFileBuilder(config);

      eftGenerator.addDebitTransaction({
        bankInstitutionNumber: '111',
        bankTransitNumber: '22222',
        bankAccountNumber: '333333333',
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE'
      });

      const output = eftGenerator.generate();

      assert.ok(!output.includes('\n'), 'output must not contain LF (0x0A)');
      assert.ok(output.includes('\r'), 'output must use CR (0x0D) as delimiter');
    });

    await it('Output contains only spec-allowed characters (spec page 59)', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        originatorShortName: 'TH(855)515-9999',
        originatorLongName: 'Total Game Plan 1(855)515-9999'
      });

      eftGenerator.addDebitTransaction({
        bankInstitutionNumber: '111',
        bankTransitNumber: '22222',
        bankAccountNumber: '333333333',
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE'
      });

      const output = eftGenerator.generate();

      // Allowed: 0-9, A-Z, blank, = _ $ . & * , plus CR record delimiter
      assert.match(output, /^[0-9A-Z =_$.&*,\r]*$/);
    });

    await it('Warns when originatorShortName contains prohibited characters', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        originatorShortName: 'TH(855)515-9999'
      });

      assert.ok(
        new EFTFileValidator(eftGenerator).validate().some(
          (validationWarning) =>
            validationWarning.warningField === 'originatorShortName' &&
            validationWarning.warning.toLowerCase().includes('prohibited')
        )
      );
    });

    await it('Warns when originatorLongName contains prohibited characters', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        originatorLongName: 'Total Game Plan 1(855)515-9999'
      });

      assert.ok(
        new EFTFileValidator(eftGenerator).validate().some(
          (validationWarning) =>
            validationWarning.warningField === 'originatorLongName' &&
            validationWarning.warning.toLowerCase().includes('prohibited')
        )
      );
    });
  });

  await describe('Spec field positions', async () => {
    function buildSampleOutput(): string {
      const eftGenerator = new EFTFileBuilder(config);
      eftGenerator.addCreditTransaction({
        bankInstitutionNumber: '111',
        bankTransitNumber: '22222',
        bankAccountNumber: '333333333',
        cpaCode: cpaCodePropertyTaxes,
        amount: 100,
        payeeName: 'TEST PAYEE'
      });
      eftGenerator.addDebitTransaction({
        bankInstitutionNumber: '111',
        bankTransitNumber: '22222',
        bankAccountNumber: '333333333',
        cpaCode: cpaCodePropertyTaxes,
        amount: 200,
        payeeName: 'TEST PAYOR'
      });
      return eftGenerator.generate();
    }

    await it('C record field 13 (positions 165-174) is 10 blanks (spec page 60)', () => {
      const lines = buildSampleOutput().split('\r');
      const cRecord = lines.find((line) => line.startsWith(RECORD_TYPE.TRANSACTION_CREDIT));
      assert.ok(cRecord, 'expected at least one C record');
      assert.strictEqual(cRecord.slice(164, 174), ' '.repeat(10));
    });

    await it('D record field 13 (positions 165-174) is 10 blanks (spec page 63)', () => {
      const lines = buildSampleOutput().split('\r');
      const dRecord = lines.find((line) => line.startsWith(RECORD_TYPE.TRANSACTION_DEBIT));
      assert.ok(dRecord, 'expected at least one D record');
      assert.strictEqual(dRecord.slice(164, 174), ' '.repeat(10));
    });

    await it('D record positions 215-247 are 33 zeros (spec page 64)', () => {
      const lines = buildSampleOutput().split('\r');
      const dRecord = lines.find((line) => line.startsWith(RECORD_TYPE.TRANSACTION_DEBIT));
      assert.ok(dRecord);
      assert.strictEqual(dRecord.slice(214, 247), '0'.repeat(33));
    });

    await it('Trailer positions 69-1464 are 1396 blanks (spec page 64)', () => {
      const lines = buildSampleOutput().split('\r');
      const trailer = lines.find((line) => line.startsWith(RECORD_TYPE.TRAILER));
      assert.ok(trailer);
      assert.strictEqual(trailer.slice(68), ' '.repeat(1396));
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
      assert.strictEqual(headerCreationDate(eftGenerator), '022001');
    });

    await it('Formats December 31 of a non-leap year as day 365', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        fileCreationDate: new Date(2022, 11, 31)
      });
      assert.strictEqual(headerCreationDate(eftGenerator), '022365');
    });

    await it('Formats December 31 of a leap year as day 366', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        fileCreationDate: new Date(2020, 11, 31)
      });
      assert.strictEqual(headerCreationDate(eftGenerator), '020366');
    });

    await it('Pads single-digit YY to two digits', () => {
      const eftGenerator = new EFTFileBuilder({
        ...config,
        fileCreationDate: new Date(2005, 0, 5)
      });
      assert.strictEqual(headerCreationDate(eftGenerator), '005005');
    });
  });
});
