/**
 * A record that can render itself to its CPA-005 fixed-width string form.
 * The four record kinds (header, transaction, segment, trailer) all
 * implement this so the generator can treat them uniformly.
 */
export interface Printable {
  print(): string;
}
