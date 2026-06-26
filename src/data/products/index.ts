import { Product as BaseProduct } from "../types";
import { Product as UnifiedProduct } from "@/types";
import { bracelets } from "./bracelets";
import { chains } from "./chains";
import { earrings } from "./earrings";
import { rings } from "./rings";
import { men } from "./men";
import { premium } from "./premium";
import { watchCharms } from "./watch-charms";

// Combine all category products
const allBaseProducts: BaseProduct[] = [
  ...bracelets,
  ...chains,
  ...earrings,
  ...rings,
  ...men,
  ...premium,
  ...watchCharms
];

// Sort products dynamically:
// 1. Collection (alphabetical: "92.5 Sterling Silver" before "Gold Collection")
// 2. Category (alphabetical)
// 3. Name (alphabetical)
// And map them to UnifiedProduct containing legacy compatibility fields.
export const products: UnifiedProduct[] = [...allBaseProducts]
  .sort((a, b) => {
    // Compare Collection (alphabetical)
    const collectionCompare = a.collection.localeCompare(b.collection);
    if (collectionCompare !== 0) {
      return collectionCompare;
    }

    // Compare Category (alphabetical)
    const categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare !== 0) {
      return categoryCompare;
    }

    // Compare Name (alphabetical)
    return a.name.localeCompare(b.name);
  })
  .map((p) => ({
    ...p,
    gender: p.category === "Men" ? "men" as const : "women" as const,
    images: [p.image, ...(p.gallery || [])],
    reviewCount: p.reviews
  }));

export default products;
