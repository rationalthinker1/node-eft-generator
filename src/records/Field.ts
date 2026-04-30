import { fixedField } from '#utils/index';
import 'reflect-metadata';

export interface FieldSpec {
  start: number;
  end: number;
  pad: ' ' | '0';
  align: 'left' | 'right';
  /**
   * Optional value transform. Receives the raw property value and the
   * instance (so transforms can read other properties — e.g. recordType,
   * segmentIndex — when computing display values like `0YYDDD` julian
   * dates, sanitized text, or context-dependent fillers).
   */
  transform?: (raw: unknown, instance: object) => string;
}

interface DecoratedField extends FieldSpec {
  propertyKey: string;
}

/**
 * Anything class-like — what `getFields` accepts and what `target.constructor`
 * resolves to inside the property decorator.
 */
export type Ctor = abstract new (...args: never[]) => unknown;

const FIELDS_KEY = Symbol('cpa005:fields');

/**
 * Property decorator that records a CPA-005 fixed-width field's spec
 * (position, padding, alignment, optional value transform) on the
 * decorated class. Read back via {@link getFields}.
 */
export function Field(spec: FieldSpec): PropertyDecorator {
  return (target, propertyKey) => {
    const ctor = target.constructor;
    const own = Reflect.getOwnMetadata(FIELDS_KEY, ctor) as DecoratedField[] | undefined;
    const fields = own ?? [];
    fields.push({ ...spec, propertyKey: propertyKey as string });
    Reflect.defineMetadata(FIELDS_KEY, fields, ctor);
  };
}

/**
 * Returns every @Field on the class, sorted by start position so the
 * caller can concatenate field renders without thinking about decoration
 * order.
 */
export function getFields(ctor: Ctor): DecoratedField[] {
  const fields = Reflect.getOwnMetadata(FIELDS_KEY, ctor) as DecoratedField[] | undefined;
  if (!fields) return [];
  return [...fields].sort((a, b) => a.start - b.start);
}

/**
 * Invoke a property's own @Field transform on the current instance value.
 * Lets `log()` (or any other consumer) read a display-ready string
 * without duplicating the transform logic that already lives on the
 * field — e.g. `formatField(this, Header, 'fileCreationDate')` returns
 * the `0YYDDD` julian rather than re-importing `toPaddedJulianDate`.
 */
export function formatField<T extends Ctor>(
  instance: object,
  ctor: T,
  propertyKey: keyof InstanceType<T> & string
): string {
  const field = getFields(ctor).find((f) => f.propertyKey === propertyKey);
  if (!field) {
    throw new Error(`No @Field decorator for property "${propertyKey}" on ${ctor.name}.`);
  }
  const raw = (instance as Record<string, unknown>)[propertyKey];
  if (field.transform) {
    return field.transform(raw, instance);
  }
  return typeof raw === 'string' ? raw : '';
}

/**
 * Walks @Field-decorated properties on `instance` (in start-position
 * order) and returns the concatenated fixed-width render of every field.
 *
 * The caller is responsible for any pad-to-record-length and length
 * assertion — callers either know the fields cover the whole record
 * exactly (header / trailer / segment) or compose the result with other
 * pieces (Transaction concatenates a 24-char prefix with up to six
 * 240-char segments before padding to 1464).
 */
export function renderFields(instance: object, ctor: Ctor): string {
  const parts: string[] = [];
  for (const f of getFields(ctor)) {
    const raw = (instance as Record<string, unknown>)[f.propertyKey];
    const value = f.transform
      ? f.transform(raw, instance)
      : typeof raw === 'string'
        ? raw
        : '';
    const width = f.end - f.start + 1;
    parts.push(fixedField(value, width, { align: f.align, pad: f.pad }));
  }
  return parts.join('');
}
