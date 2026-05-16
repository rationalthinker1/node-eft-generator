# CLAUDE.md

Project context for AI assistants working in this repo.

## What this is

A Node library that formats Electronic Funds Transfer data into the
Canadian Payments Association CPA-005 fixed-width text standard.
Published as `@rationalthinker1/eft-generator`. Forked from
`cityssm/node-eft-generator`.

## Commands

- `yarn build` — compile `src/` to `build/`
- `yarn typecheck` — `tsc -p tsconfig.test.typecheck.json` (covers tests too)
- `yarn lint` — ESLint
- `yarn format` / `yarn format:check` — Prettier on `{src,tests}/**/*.ts`
- `yarn test` — build then run `node --test build/tests/**/*.js`
- `yarn coverage` — same as test, with c8 coverage reporting
- `yarn ci:check` — full CI pipeline (typecheck + lint + format + coverage)

## Architecture

Each CPA-005 record type is a class in `src/records/`:

- [Header](src/records/Header.ts) — file-level identity (record 1)
- [Transaction](src/records/Transaction.ts) — wraps 1–6 segments per record
- [Segment](src/records/Segment.ts) — 240-char payment payload
- [Trailer](src/records/Trailer.ts) — totals (last record)

Field positions are declared via `@Field({ start, end, pad, align, transform?, validate? })`
decorators (see [Field.ts](src/records/Field.ts)). The decorator records
metadata via `reflect-metadata`; helpers `renderFields`, `validateFields`,
`formatField`, and `collectFieldValues` walk that metadata.

Records implement marker interfaces from [types.ts](src/types.ts):
`Printable`, `Loggable`, `Validable`, `UsesFields<T, K>`.

[EFTFileBuilder](src/EFTFileBuilder.ts) is the public entry point. Its
`generate()` returns `{ output: string; lines: Array<...> }` — `output`
is the full CPA-005 string; `lines` exposes each record's field values
as `{ before, after }` (see README *Usage*).

[EFTFileValidator](src/EFTFileValidator.ts) runs cross-record invariants
(e.g. unique cross-references, file-length checks). It's invoked
automatically by `generate()` but can be called directly via
`builder.validate()`.

[BankPADInformation](src/domain/BankPADInformation.ts) holds the
Payments Canada FI list (`BankInstitutions` const map) and
runtime-validating constructors `bankInstitution`, `bankTransit`,
`bankAccount`. The associated types are plain string aliases (no brands).

## Conventions

- Group related top-level functions into a class with static methods.
  Loose top-level helpers are tolerated only in [src/utils/index.ts](src/utils/index.ts).
- Subpath imports use the `#name` aliases from `package.json`'s
  `imports` map — never relative paths like `../records/Field`.
- Tests live in [tests/test.ts](tests/test.ts) and use `node:test`.
- Node `>=24`, ESM only (`"type": "module"`).

## Notable spec references

- [CPA Standard 005](https://www.payments.ca/sites/default/files/standard005eng.pdf)
- Bundled bank PDFs: [docs/rbc-cpa-005-reference.pdf](docs/rbc-cpa-005-reference.pdf), [docs/bmo-cpa-005-reference.pdf](docs/bmo-cpa-005-reference.pdf)
