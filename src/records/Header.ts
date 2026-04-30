import type { EFTFileBuilder } from '#EFTFileBuilder';
import { Field, formatField, renderFields, validateFields } from '#records/Field';
import { Logger } from '#utils/Logger';
import { SEGMENT_FIELD_WIDTHS } from '#records/Segment';
import { RECORD_TYPE, type Loggable, type Printable, type Validable } from '#types';
import {
  assertRecordLength,
  containsProhibitedCharacters,
  sanitizeCPA005Text,
  toPaddedJulianDate
} from '#utils/index';

const RECORD_LENGTH = 1464;
const DIGITS_ONLY = /^\d+$/;

export const HEADER_FIELD_WIDTHS = {
  originatorId: 10,
  originatorShortName: 15,
  originatorLongName: 30
} as const;

export class Header implements Printable, Loggable, Validable {
  readonly #builder: EFTFileBuilder;

  @Field({ start: 1, end: 1, pad: '0', align: 'right' })
  recordType = RECORD_TYPE.HEADER;

  @Field({ start: 2, end: 10, pad: '0', align: 'right' })
  logicalRecordCount = '1';

  @Field({
    start: 11,
    end: 20,
    pad: ' ',
    align: 'left',
    transform: (v) => sanitizeCPA005Text(v as string),
    validate: (value) => {
      if (value.length > HEADER_FIELD_WIDTHS.originatorId) {
        throw new Error(
          `originatorId length exceeds ${String(HEADER_FIELD_WIDTHS.originatorId)}: ${value}`
        );
      }
    }
  })
  originatorId!: string;

  @Field({
    start: 21,
    end: 24,
    pad: '0',
    align: 'right',
    validate: (value) => {
      if (!/^\d{1,4}$/.test(value)) {
        throw new Error(`fileCreationNumber should be 1 to 4 digits: ${value}`);
      }
    }
  })
  fileCreationNumber!: string;

  @Field({
    start: 25,
    end: 30,
    pad: '0',
    align: 'right',
    transform: (v) => toPaddedJulianDate(v as Date)
  })
  fileCreationDate!: Date;

  @Field({
    start: 31,
    end: 35,
    pad: '0',
    align: 'right',
    validate: (value) => {
      if (!/^\d{1,5}$/.test(value)) {
        throw new Error(`destinationDataCentre should be 1 to 5 digits: ${value}`);
      }
    }
  })
  destinationDataCentre!: string;

  @Field({ start: 36, end: 55, pad: ' ', align: 'left' })
  reservedHeader = '';

  @Field({
    start: 56,
    end: 58,
    pad: ' ',
    align: 'left',
    validate: (value) => {
      if (!['', 'CAD', 'USD'].includes(value)) {
        throw new Error(`Unsupported destinationCurrency: ${value || '<unset>'}`);
      }
    }
  })
  destinationCurrency!: string;

  @Field({ start: 59, end: RECORD_LENGTH, pad: ' ', align: 'left' })
  headerFiller = '';

  constructor(builder: EFTFileBuilder) {
    this.#builder = builder;
    const cfg = builder.getConfiguration();
    this.originatorId = cfg.originatorId;
    this.fileCreationNumber = cfg.fileCreationNumber;
    this.fileCreationDate = cfg.fileCreationDate ?? new Date();
    this.destinationDataCentre = cfg.destinationDataCentre;
    this.destinationCurrency = cfg.destinationCurrency ?? '';
  }

  print(): string {
    this.log();
    return assertRecordLength(renderFields(this, Header), 'header', RECORD_LENGTH);
  }

  /**
   * Validates the file-level configuration. Header is the file's identity
   * gateway, so it owns every {@link EFTConfiguration} check — the
   * originator-name fields are validated here even though they're
   * physically encoded on segments, since they're file-config (one value
   * per file, denormalized across segments).
   */
  validate(): void {
    const cfg = this.#builder.getConfiguration();

    validateFields(this, Header);

    if (containsProhibitedCharacters(cfg.originatorId)) {
      throw new Error(`originatorId contains prohibited characters: ${cfg.originatorId}`);
    }

    if (cfg.originatorShortName.length > HEADER_FIELD_WIDTHS.originatorShortName) {
      throw new Error(
        `originatorShortName exceeds ${String(HEADER_FIELD_WIDTHS.originatorShortName)} characters: ${cfg.originatorShortName}`
      );
    }
    if (containsProhibitedCharacters(cfg.originatorShortName)) {
      throw new Error(
        `originatorShortName contains prohibited characters: ${cfg.originatorShortName}`
      );
    }

    if (cfg.originatorLongName.length > HEADER_FIELD_WIDTHS.originatorLongName) {
      throw new Error(
        `originatorLongName exceeds ${String(HEADER_FIELD_WIDTHS.originatorLongName)} characters: ${cfg.originatorLongName}`
      );
    }
    if (containsProhibitedCharacters(cfg.originatorLongName)) {
      throw new Error(
        `originatorLongName contains prohibited characters: ${cfg.originatorLongName}`
      );
    }

    // return* must be defined together or not at all.
    const returnFields = [
      cfg.returnInstitutionNumber,
      cfg.returnTransitNumber,
      cfg.returnAccountNumber
    ];
    const definedCount = returnFields.filter((f) => f !== undefined).length;
    if (definedCount > 0 && definedCount < returnFields.length) {
      throw new Error(
        'returnInstitutionNumber, returnTransitNumber, and returnAccountNumber must be defined together, or not defined at all.'
      );
    }

    if (cfg.returnInstitutionNumber !== undefined) {
      validateDigitsField(
        'returnInstitutionNumber',
        cfg.returnInstitutionNumber,
        SEGMENT_FIELD_WIDTHS.returnInstitutionNumber
      );
    }
    if (cfg.returnTransitNumber !== undefined) {
      validateDigitsField(
        'returnTransitNumber',
        cfg.returnTransitNumber,
        SEGMENT_FIELD_WIDTHS.returnTransitNumber
      );
    }
    if (cfg.returnAccountNumber !== undefined) {
      validateDigitsField(
        'returnAccountNumber',
        cfg.returnAccountNumber,
        SEGMENT_FIELD_WIDTHS.returnAccountNumber
      );
    }
  }

  log(): void {
    const julian = formatField(this, Header, 'fileCreationDate');
    const dayOfYear = julian.slice(3);

    Logger.title('HEADER');
    Logger.row('originator', `<b>${this.originatorId}</b>`);
    Logger.row('fcn', `<b>${this.fileCreationNumber}</b>`);
    Logger.row(
      'created',
      `${Logger.isoDate(this.fileCreationDate)}<dim>  ·  day ${dayOfYear}  ·  julian ${julian}</dim>`
    );
    Logger.row('centre', this.destinationDataCentre);
    Logger.row(
      'currency',
      this.destinationCurrency === '' ? '(default)' : this.destinationCurrency
    );
    Logger.endSection();
  }
}

function validateDigitsField(fieldName: string, value: string, width: number): void {
  if (!DIGITS_ONLY.test(value)) {
    throw new Error(`${fieldName} must contain only digits: ${value}`);
  }
  if (value.length > width) {
    throw new Error(`${fieldName} length exceeds ${String(width)}: ${value}`);
  }
}
