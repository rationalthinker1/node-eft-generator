import type { EFTFileBuilder } from '#EFTFileBuilder';
import { Field, formatField, renderFields } from '#records/Field';
import { FIELD_WIDTHS, RECORD_LENGTH } from '#domain/spec';
import type { Loggable } from '#contracts/Loggable';
import { Logger } from '#utils/Logger';
import type { Printable } from '#contracts/Printable';
import { RECORD_TYPE } from '#domain/types';
import type { Validable } from '#contracts/Validable';
import {
  assertRecordLength,
  containsProhibitedCharacters,
  sanitizeCPA005Text,
  toPaddedJulianDate
} from '#utils/index';

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
    transform: (v) => sanitizeCPA005Text(v as string)
  })
  originatorId!: string;

  @Field({ start: 21, end: 24, pad: '0', align: 'right' })
  fileCreationNumber!: string;

  @Field({
    start: 25,
    end: 30,
    pad: '0',
    align: 'right',
    transform: (v) => toPaddedJulianDate(v as Date)
  })
  fileCreationDate!: Date;

  @Field({ start: 31, end: 35, pad: '0', align: 'right' })
  destinationDataCentre!: string;

  @Field({ start: 36, end: 55, pad: ' ', align: 'left' })
  reservedHeader = '';

  @Field({ start: 56, end: 58, pad: ' ', align: 'left' })
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

    if (cfg.originatorId.length > FIELD_WIDTHS.originatorId) {
      throw new Error(
        `originatorId length exceeds ${String(FIELD_WIDTHS.originatorId)}: ${cfg.originatorId}`
      );
    }
    if (containsProhibitedCharacters(cfg.originatorId)) {
      throw new Error(`originatorId contains prohibited characters: ${cfg.originatorId}`);
    }

    if (!/^\d{1,4}$/.test(cfg.fileCreationNumber)) {
      throw new Error(
        `fileCreationNumber should be 1 to 4 digits: ${cfg.fileCreationNumber}`
      );
    }

    if (!/^\d{1,5}$/.test(cfg.destinationDataCentre)) {
      throw new Error(
        `destinationDataCentre should be 1 to 5 digits: ${cfg.destinationDataCentre}`
      );
    }

    if (cfg.originatorShortName.length > FIELD_WIDTHS.originatorShortName) {
      throw new Error(
        `originatorShortName exceeds ${String(FIELD_WIDTHS.originatorShortName)} characters: ${cfg.originatorShortName}`
      );
    }
    if (containsProhibitedCharacters(cfg.originatorShortName)) {
      throw new Error(
        `originatorShortName contains prohibited characters: ${cfg.originatorShortName}`
      );
    }

    if (cfg.originatorLongName.length > FIELD_WIDTHS.originatorLongName) {
      throw new Error(
        `originatorLongName exceeds ${String(FIELD_WIDTHS.originatorLongName)} characters: ${cfg.originatorLongName}`
      );
    }
    if (containsProhibitedCharacters(cfg.originatorLongName)) {
      throw new Error(
        `originatorLongName contains prohibited characters: ${cfg.originatorLongName}`
      );
    }

    if (!['', 'CAD', 'USD'].includes(cfg.destinationCurrency ?? '')) {
      throw new Error(
        `Unsupported destinationCurrency: ${cfg.destinationCurrency ?? '<unset>'}`
      );
    }

    // return* must be defined together or not at all (their branded
    // constructors already validated each value's shape).
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
