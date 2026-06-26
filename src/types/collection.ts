/**
 * Collection Interface
 * Represents an editorial collection category grid tile.
 */
export interface Collection {
  name: string;
  href: string;
  imageSrc: string;
  size: "large" | "medium" | "small";
}
