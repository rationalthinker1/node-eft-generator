/**
 * A record that can validate its own CPA-005 invariants. Each
 * implementation must throw on the first violation it sees; never return.
 *
 * Records implement this so EFTFileValidator stays an orchestrator —
 * each record owns its own checks and the validator only adds file-level
 * cross-cutting concerns (uniqueness across segments, transaction counts,
 * and post-generation output checks).
 */
export interface Validable {
  validate(): void;
}
