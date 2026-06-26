import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source directories and mappings
const SOURCE_DIR = "C:/Users/prakash/Downloads/jewel-pics";
const PROJECT_ROOT = path.resolve(__dirname, "..");
const JSON_OUTPUT_PATH = path.join(PROJECT_ROOT, "cloudinary-images.json");
const CONTENT_TS_PATH = path.join(PROJECT_ROOT, "src", "constants", "content.ts");

const categoryMapping = {
  "Bracelets": "Bracelets",
  "Chains": "Chains & Pendants",
  "Earrings": "Earrings",
  "Rings": "Rings",
  "Men": "Men",
  "Premium Collection": "Premium",
  "Watch Charms": "Watch Charms",
};

// Helper function to read files recursively
function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) {
    console.error(`Source directory does not exist: ${dir}`);
    return results;
  }
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if ([".webp", ".png", ".jpg", ".jpeg"].includes(ext)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

// Capitalize helper
function capitalize(str) {
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// Generate realistic price based on category
function getRealisticPrice(category, index) {
  let price = 1499;
  if (category === "Bracelets") {
    price = 1799 + (index * 130) % 1500;
  } else if (category === "Chains & Pendants") {
    price = 1599 + (index * 170) % 1800;
  } else if (category === "Earrings") {
    price = 899 + (index * 90) % 1100;
  } else if (category === "Rings") {
    price = 999 + (index * 110) % 900;
  } else if (category === "Men") {
    price = 1999 + (index * 210) % 1600;
  } else if (category === "Premium") {
    price = 3299 + (index * 290) % 2500;
  } else if (category === "Watch Charms") {
    price = 699 + (index * 60) % 600;
  }
  return price;
}

async function main() {
  console.log("Checking Cloudinary Configuration...");
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Error: Missing Cloudinary credentials in .env.local!");
    process.exit(1);
  }

  console.log(`Scanning local files in ${SOURCE_DIR}...`);
  const files = getFilesRecursively(SOURCE_DIR);
  console.log(`Found ${files.length} images to process.`);

  const uploadedImages = [];
  const products = [];

  // Categorized dictionary to hold images for collection hero selection
  const categoryImages = {};

  let successCount = 0;
  let index = 0;

  for (const filePath of files) {
    index++;
    // Get relative path to compute metal and category folder
    const relativePath = path.relative(SOURCE_DIR, filePath);
    const pathParts = relativePath.split(path.sep);

    if (pathParts.length < 3) {
      console.log(`Skipping file with incorrect path structure: ${relativePath}`);
      continue;
    }

    const metal = pathParts[0].toLowerCase(); // 'gold' or 'silver'
    const subfolderCategory = pathParts[1]; // 'Bracelets', 'Chains', etc.
    const originalFileName = pathParts[pathParts.length - 1];
    const baseName = path.parse(originalFileName).name;

    const mappedCategory = categoryMapping[subfolderCategory] || subfolderCategory;

    // Premium Display Name
    const metalPrefix = metal === "gold" ? "Gold Plated" : "92.5 Sterling Silver";
    const productName = `${metalPrefix} ${baseName}`;
    const slug = `${metal}-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    const folderOnCloudinary = `house_of_turtles/${metal}/${subfolderCategory}`;
    console.log(`[${index}/${files.length}] Uploading ${productName}...`);

    try {
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: folderOnCloudinary,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "image",
      });

      let cloudinaryUrl = uploadResult.secure_url;
      // Force all URL extensions to be .webp for Cloudinary auto-conversion
      const extIndex = cloudinaryUrl.lastIndexOf(".");
      if (extIndex > -1) {
        cloudinaryUrl = cloudinaryUrl.substring(0, extIndex) + ".webp";
      }
      successCount++;

      const productId = `p-${metal}-${subfolderCategory.toLowerCase().slice(0, 3)}-${index}`;

      // 1. Record for the requested JSON output
      uploadedImages.push({
        idNumber: index,
        id: productId,
        name: productName,
        fileName: originalFileName,
        metal: metal,
        category: mappedCategory,
        cloudinaryUrl: cloudinaryUrl,
      });

      // 2. Track for category collection hero images selection
      if (!categoryImages[mappedCategory]) {
        categoryImages[mappedCategory] = [];
      }
      categoryImages[mappedCategory].push(cloudinaryUrl);

      // 3. Generate Mock Product Entry
      const price = getRealisticPrice(mappedCategory, index);
      const originalPrice = price + Math.ceil((price * 0.25) / 100) * 100; // ~25% markup for original price

      const badgeList = ["New", "20% off", "Only 3 left", null, null, null];
      const badge = badgeList[index % badgeList.length];

      products.push({
        id: productId,
        name: productName,
        slug: slug,
        price: price,
        originalPrice: originalPrice,
        images: [cloudinaryUrl], // Next.js product page uses images[0] for main
        category: mappedCategory,
        badge: badge || undefined,
        rating: parseFloat((4.4 + (index * 0.07) % 0.6).toFixed(1)),
        reviewCount: 12 + (index * 7) % 95,
        inStock: true,
      });

    } catch (error) {
      console.error(`Failed to upload ${relativePath}:`, error.message);
    }
  }

  console.log(`\nSuccessfully uploaded ${successCount} of ${files.length} images.`);

  // Write name/link JSON file requested by the user
  console.log(`Writing image data mapping to ${JSON_OUTPUT_PATH}...`);
  fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(uploadedImages, null, 2), "utf8");

  // Prepare updated COLLECTIONS
  // For each collection, we pick the first uploaded image in that category as its background image
  const updatedCollections = [
    {
      name: "Bracelets",
      href: "/shop?category=Bracelets",
      imageSrc: categoryImages["Bracelets"]?.[0] || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      size: "large",
    },
    {
      name: "Chain Collection",
      href: "/shop?category=Chains+%26+Pendants",
      imageSrc: categoryImages["Chains & Pendants"]?.[0] || "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
      size: "medium",
    },
    {
      name: "Men Collection",
      href: "/shop?category=Men",
      imageSrc: categoryImages["Men"]?.[0] || "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
      size: "small",
    },
    {
      name: "Earrings",
      href: "/shop?category=Earrings",
      imageSrc: categoryImages["Earrings"]?.[0] || "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      size: "small",
    },
    {
      name: "Premium Collection",
      href: "/shop?category=Premium",
      imageSrc: categoryImages["Premium"]?.[0] || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop",
      size: "small",
    },
    {
      name: "Watch Charms",
      href: "/shop?category=Watch+Charms",
      imageSrc: categoryImages["Watch Charms"]?.[0] || "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop",
      size: "small",
    }
  ];

  const updatedProductTabs = [
    "Bracelets",
    "Chains & Pendants",
    "Earrings",
    "Rings",
    "Men",
    "Premium",
    "Watch Charms"
  ];

  console.log("Updating src/constants/content.ts...");

  // Generate full code file to write
  const updatedContentCode = `import { Product, Collection } from "../types";

export const SITE = {
  name: "House of Turtles",
  tagline: "Stories you carry. Silver that lasts.",
  description: "Handcrafted 92.5 Sterling Silver, delivered with care across India.",
  instagram: "https://www.instagram.com/houseofturtles.in/",
  whatsapp: "https://wa.me/919491933109",
  email: "care@houseofturtles.in",
};

export const ANNOUNCEMENT_MESSAGES = [
  "Free shipping on orders above ₹999 across India",
  "Summer Sale — Flat 20% off all Bracelets",
  "New Collection: Gold Plated Earrings just dropped →"
];

export const NAV_LINKS = [
  { label: "Silver", href: "/shop?category=Silver" },
  { label: "Gold Plated", href: "/shop?category=Gold+Plated" },
  { label: "Men", href: "/shop?category=Men" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Sale", href: "/shop?filter=sale" }
];

export const COLLECTIONS: Collection[] = ${JSON.stringify(updatedCollections, null, 2)};

export const TRUST_ITEMS = [
  { icon: "Truck", title: "PAN India Shipping", desc: "Safe delivery everywhere" },
  { icon: "ShieldCheck", title: "100% Authentic", desc: "92.5 certified silver" },
  { icon: "Leaf", title: "Ethically Sourced", desc: "Fair trade materials" },
  { icon: "RotateCcw", title: "Easy Returns", desc: "30-day return policy" }
];

export const FAQ_ITEMS = [
  {
    q: "Is your jewellery made of genuine 92.5 Sterling Silver?",
    a: "Yes, every single piece of jewellery at House of Turtles is handcrafted in 92.5% pure Sterling Silver and stamped with the 92.5 hallmark certificate tag for authenticity."
  },
  {
    q: "Does the silver tarnish and how do I prevent it?",
    a: "Silver naturally oxidizes over time. To prevent tarnishing, keep your jewellery away from water, perfumes, and humidity. Store it inside the zip-lock bag provided inside your House of Turtles box when not in use."
  },
  {
    q: "How long does shipping take and is it free?",
    a: "We offer free shipping on all orders above ₹999. Deliveries usually take 3 to 5 business days for major metro areas and 5 to 7 days for regional parts of India."
  },
  {
    q: "What is your return and exchange policy?",
    a: "We support a hassle-free 30-day return and exchange policy. If you are not satisfied with your purchase, you can contact our care team to arrange a reverse pickup."
  },
  {
    q: "Do you offer international shipping?",
    a: "Currently, we only ship orders within India. We plan to expand shipping to international regions in the near future."
  }
];

export const STYLE_OCCASIONS = [
  { label: "Smart Casual", href: "/shop?style=casual", imageSrc: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop" },
  { label: "Day Out", href: "/shop?style=dayout", imageSrc: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop" },
  { label: "Party Wear", href: "/shop?style=party", imageSrc: "https://images.unsplash.com/photo-1481988535861-271139e0646c?q=80&w=400&auto=format&fit=crop" },
  { label: "Summer Date", href: "/shop?style=date", imageSrc: "https://images.unsplash.com/photo-1596568300556-a3b0a6006232?q=80&w=400&auto=format&fit=crop" },
  { label: "Daily Wear", href: "/shop?style=daily", imageSrc: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop" }
];

export const FOOTER_LINKS = {
  Shop: [
    { label: "All Jewellery", href: "/shop" },
    { label: "Bracelets", href: "/shop?category=Bracelets" },
    { label: "Chains & Pendants", href: "/shop?category=Chains" },
    { label: "Earrings", href: "/shop?category=Earrings" },
    { label: "Watch Charms", href: "/shop?category=Charms" }
  ],
  Help: [
    { label: "Track Order", href: "/track-order" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Jewellery Care", href: "/care" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faqs" }
  ],
  Company: [
    { label: "Our Story", href: "/about" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
    { label: "Store Locator", href: "/stores" }
  ]
};

export const PRODUCT_TABS = ${JSON.stringify(updatedProductTabs, null, 2)};

export const PRODUCTS_MOCK: Product[] = ${JSON.stringify(products, null, 2)};
`;

  fs.writeFileSync(CONTENT_TS_PATH, updatedContentCode, "utf8");
  console.log("Done! Constants database updated with Cloudinary URLs.");
}

main().catch(err => {
  console.error("Execution failed:", err);
  process.exit(1);
});
