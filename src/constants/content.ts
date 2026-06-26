import { Product, Collection } from "../types";
import { products } from "@/data/products";

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

export const COLLECTIONS: Collection[] = [
  {
    "name": "Bracelets",
    "href": "/shop?category=Bracelets",
    "imageSrc": "https://res.cloudinary.com/dhpzoucie/image/upload/v1782381926/house_of_turtles/gold/Bracelets/Aanaya_Bracelet.webp",
    "size": "large"
  },
  {
    "name": "Chain Collection",
    "href": "/shop?category=Chains+%26+Pendants",
    "imageSrc": "https://res.cloudinary.com/dhpzoucie/image/upload/v1782381936/house_of_turtles/gold/Chains/Butterfly_Chain.webp",
    "size": "medium"
  },
  {
    "name": "Men Collection",
    "href": "/shop?category=Men",
    "imageSrc": "https://res.cloudinary.com/dhpzoucie/image/upload/v1782381997/house_of_turtles/silver/Men/Hanuman_Pendant.webp",
    "size": "small"
  },
  {
    "name": "Earrings",
    "href": "/shop?category=Earrings",
    "imageSrc": "https://res.cloudinary.com/dhpzoucie/image/upload/v1782381946/house_of_turtles/gold/Earrings/Aurelia_Crystal_Bloom.webp",
    "size": "small"
  },
  {
    "name": "Premium Collection",
    "href": "/shop?category=Premium",
    "imageSrc": "https://res.cloudinary.com/dhpzoucie/image/upload/v1782382003/house_of_turtles/silver/Premium%20Collection/Gold_Serpentine.webp",
    "size": "small"
  },
  {
    "name": "Watch Charms",
    "href": "/shop?category=Watch+Charms",
    "imageSrc": "https://res.cloudinary.com/dhpzoucie/image/upload/v1782382006/house_of_turtles/silver/Watch%20Charms/Butterfly_Watch_Charm.webp",
    "size": "small"
  }
];

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
    { label: "92.5 Sterling Silver", href: "/silver" },
    { label: "Gold Plated Collection", href: "/gold" },
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Sale Collections", href: "/shop?filter=sale" }
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

export const PRODUCT_TABS = [
  "Bracelets",
  "Chains & Pendants",
  "Earrings",
  "Rings",
  "Men",
  "Premium",
  "Watch Charms"
];

// Reference products dynamically to solve legacy compilation issues.
export const PRODUCTS_MOCK: Product[] = products;
