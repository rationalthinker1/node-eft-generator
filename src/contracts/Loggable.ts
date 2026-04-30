/**
 * A record that can log itself to the console during file generation.
 * Each record kind owns its own presentation; the generator calls
 * `.log()` after building the instance and before/after `.print()`.
 */
export interface Loggable {
  log(): void;
}
