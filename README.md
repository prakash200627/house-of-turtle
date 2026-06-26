# House of Turtles — Premium E-Commerce Portal

A high-fidelity, luxury e-commerce web application for **House of Turtles**, showcasing handcrafted 92.5 Sterling Silver and 18K Gold Plated jewellery. Built with a modern, performance-oriented Next.js stack.

---

## 🚀 Getting Started
Install dependencies and run the development server:
```bash
pnpm install
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ Technology Stack
* **Framework**: Next.js 15 (App Router)
* **Language**: TypeScript (strict type checking)
* **Styling**: Tailwind CSS (custom themed colors & responsive layout scaling)
* **State Management**: Zustand (persisted state middleware for local persistence)
* **Forms & Validation**: React Hook Form
* **Animations**: Framer Motion (snappy transitions, 120ms-180ms speeds)
* **Icons**: Lucide React

---

## ✨ Key Features
1. **Dynamic Catalog (`/shop`, `/silver`, `/gold`)**:
   - Filter products by gender (Men/Women) and categories.
   - Dynamic sorting by price, ratings, and bestsellers.
   - Tabbed filtering structures.
2. **Product Details Page (PDP) (`/products/[slug]`)**:
   - Dynamic parameter matching.
   - Interactive thumbnail selector gallery.
   - Specific detailing tables (estimated weight, metal purity, occasion mapping).
   - "You May Also Like" Related items carousel based on matching categories.
3. **Cart & Wishlist State Stores**:
   - Persisted stores mapping items and wishlist IDs.
   - Snappy drawer sliders and animated grid card removals via Framer Motion's `AnimatePresence`.
4. **Seamless Checkout Process (`/checkout`)**:
   - Guest Checkout: Inline login, register, or guest checkout options on Step 1.
   - Address Step: Shipping input form with field validations.
   - Payment Step: UPI QR simulator, credit/debit card entries, or COD options.
   - Success Screen: Resets shopping bag, generates order references, and links back home.
5. **Aesthetics & Performance**:
   - Harmonious dark-mode accents using the Custom Saturated Gold (`#C68A0C`) and Espresso (`#1A1208`) palette.
   - Hover animations, desktop menu pre-scaling, and typography layouts adjusted for readability.

---

## 📂 Directory Structure
* `src/app/` — Route pages (`/`, `/shop`, `/silver`, `/gold`, `/products/[slug]`, `/checkout`, `/wishlist`, `/login`, `/register`).
* `src/components/` — Modular components split into `common/`, `layout/` (Header, Footer, CartDrawer), `product/` (Cards, Grids, QuickAdd), `sections/` (FAQ, Hero, StyleGuide, TrustBar), and `ui/` elements.
* `src/stores/` — Zustand store files for authentication (`authStore.ts`), shopping cart (`cartStore.ts`), and user wishlist (`wishlistStore.ts`).
* `src/data/` — Modularized static catalog databases.
* `src/types/` — Shared TypeScript type declarations.
* `src/lib/` — Formatting and Tailwind class utilities.