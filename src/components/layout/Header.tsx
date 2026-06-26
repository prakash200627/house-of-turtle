"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Menu, Search, X, ChevronDown, User } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { SITE } from "@/constants/content";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useMounted } from "@/hooks/useMounted";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * Header Component
 * Renders the primary brand navigation.
 * Features hover-activated mega-menus for Silver and Gold, collapsible mobile accordion,
 * search overlay, and shopping bag/wishlist actions.
 */
export function Header() {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const router = useRouter();
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();
  const { data: session, status } = useSession();
  const setSession = useAuthStore((s) => s.setSession);
  const signOutAction = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    setSession(session, status);
  }, [session, status, setSession]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mounted = useMounted();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.metal.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Mega-menu hover states
  const [activeHoverTab, setActiveHoverTab] = useState<"silver" | "gold" | null>(null);

  // Mobile navigation collapsible states
  const [mobileSilverOpen, setMobileSilverOpen] = useState(false);
  const [mobileGoldOpen, setMobileGoldOpen] = useState(false);

  const totalItems = cartStore.items.reduce((sum, item) => sum + item.quantity, 0);
  const hasWishlistItems = wishlistStore.productIds.length > 0;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-shadow duration-150 h-[64px] md:h-[72px] flex items-center bg-white ${
          scrolled || activeHoverTab
            ? "border-b border-gold/10 shadow-card"
            : "border-b border-transparent"
        }`}
        onMouseLeave={() => setActiveHoverTab(null)}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
          
          {/* Left: Mobile Hamburger / Desktop Silver & Gold */}
          <div className="flex md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="text-espresso hover:text-gold transition-colors p-2 -ml-2"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-offwhite p-6 flex flex-col justify-between overflow-y-auto">
                <div className="mt-8 flex flex-col space-y-6">
                  <div className="border-b border-gold/20 pb-4 mb-4">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-display text-2xl font-bold tracking-wider text-espresso"
                    >
                      {SITE.name}
                    </Link>
                  </div>
                  
                  {/* Mobile Navigation List */}
                  <nav className="flex flex-col space-y-4">
                    {/* Silver Dropdown */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => setMobileSilverOpen(!mobileSilverOpen)}
                        className="flex items-center justify-between text-left text-lg font-semibold text-espresso uppercase tracking-wider py-2 border-b border-gold/5"
                      >
                        <span>Silver Collection</span>
                        <ChevronDown className={`h-4.5 w-4.5 transition-transform ${mobileSilverOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      <AnimatePresence>
                        {mobileSilverOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col pl-4 mt-2 space-y-3"
                          >
                            <span className="text-[10px] uppercase font-bold tracking-widest text-sand mt-1">Women</span>
                            <Link href="/silver?gender=women" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">All Women's Silver</Link>
                            <Link href="/silver?category=Bracelets" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Bracelets</Link>
                            <Link href="/silver?category=Chains+%26+Pendants" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Chains & Pendants</Link>
                            <Link href="/silver?category=Earrings" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Earrings</Link>
                            <Link href="/silver?category=Premium" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Premium Line</Link>
                            <Link href="/silver?category=Watch+Charms" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Watch Charms</Link>
                            
                            <span className="text-[10px] uppercase font-bold tracking-widest text-sand mt-2">Men</span>
                            <Link href="/silver?gender=men" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">All Men's Silver</Link>
                            <Link href="/silver?category=Men" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Rudra & Curb Bracelets</Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Gold Plated Dropdown */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => setMobileGoldOpen(!mobileGoldOpen)}
                        className="flex items-center justify-between text-left text-lg font-semibold text-espresso uppercase tracking-wider py-2 border-b border-gold/5"
                      >
                        <span>Gold Plated</span>
                        <ChevronDown className={`h-4.5 w-4.5 transition-transform ${mobileGoldOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      <AnimatePresence>
                        {mobileGoldOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col pl-4 mt-2 space-y-3"
                          >
                            <span className="text-[10px] uppercase font-bold tracking-widest text-sand mt-1">Women</span>
                            <Link href="/gold?gender=women" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">All Women's Gold</Link>
                            <Link href="/gold?category=Bracelets" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Bracelets</Link>
                            <Link href="/gold?category=Chains+%26+Pendants" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Chains & Pendants</Link>
                            <Link href="/gold?category=Earrings" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Earrings</Link>
                            <Link href="/gold?category=Rings" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-espresso/80 hover:text-gold">Rings</Link>
                            
                            <span className="text-[10px] uppercase font-bold tracking-widest text-sand mt-2">Men</span>
                            <span className="text-xs text-sand/65 italic">Custom Gold Line Coming Soon</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Link
                      href="/shop?filter=new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-semibold text-espresso hover:text-gold uppercase tracking-wider py-2 border-b border-gold/5"
                    >
                      New Arrivals
                    </Link>
                    <Link
                      href="/shop?filter=sale"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-semibold text-espresso hover:text-gold uppercase tracking-wider py-2 border-b border-gold/5"
                    >
                      Sale
                    </Link>
                  </nav>
                </div>
                <div className="border-t border-gold/20 pt-6 mt-8">
                  <p className="text-xs text-sand font-medium uppercase tracking-widest">{SITE.tagline}</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Left Nav Links (Silver & Gold) */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Silver Link */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveHoverTab("silver")}
            >
              <Link
                href="/silver"
                className={`flex items-center gap-1 text-xs md:text-[13px] uppercase tracking-wider font-semibold transition-[color,transform] duration-120 hover:scale-[1.03] ${
                  activeHoverTab === "silver" || pathname === "/silver"
                    ? "text-gold-bright font-bold"
                    : "text-espresso hover:text-gold-bright"
                }`}
              >
                <span>Silver</span>
                <ChevronDown className="h-3 w-3" />
              </Link>
            </div>

            {/* Gold Plated Link */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveHoverTab("gold")}
            >
              <Link
                href="/gold"
                className={`flex items-center gap-1 text-xs md:text-[13px] uppercase tracking-wider font-semibold transition-[color,transform] duration-120 hover:scale-[1.03] ${
                  activeHoverTab === "gold" || pathname === "/gold"
                    ? "text-gold-bright font-bold"
                    : "text-espresso hover:text-gold-bright"
                }`}
              >
                <span>Gold Plated</span>
                <ChevronDown className="h-3 w-3" />
              </Link>
            </div>
          </nav>

          {/* Center Logo */}
          <div className="flex-1 md:flex-initial text-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link
              href="/"
              className="font-display text-2xl md:text-3xl font-bold tracking-widest text-espresso hover:text-gold-bright transition-colors select-none"
            >
              {SITE.name}
            </Link>
          </div>

          {/* Right Navigation & Action Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* Desktop right Nav links */}
            <div className="hidden md:flex items-center justify-end space-x-8 w-[190px] mr-4 whitespace-nowrap">
              <Link
                href="/shop?filter=new"
                className="relative text-xs md:text-[13px] uppercase tracking-wider font-semibold text-espresso hover:text-gold-bright transition-[color,transform] duration-120 hover:scale-[1.03] py-1 group"
              >
                New Arrivals
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-bright transition-[width] duration-150 group-hover:w-full" />
              </Link>
              <Link
                href="/shop?filter=sale"
                className="relative text-xs md:text-[13px] uppercase tracking-wider font-semibold text-espresso hover:text-gold-bright transition-[color,transform] duration-120 hover:scale-[1.03] py-1 group"
              >
                Sale
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-bright transition-[width] duration-150 group-hover:w-full" />
              </Link>
            </div>

            {/* Action Icons */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-espresso hover:text-gold-bright transition-colors flex items-center justify-center"
              aria-label="Search Catalog"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/wishlist"
              className="p-2 text-espresso hover:text-gold-bright transition-colors relative flex items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart
                className={`h-5 w-5 transition-[color,transform] duration-150 ${
                  mounted && hasWishlistItems ? "fill-gold text-gold scale-110" : ""
                }`}
              />
            </Link>
            {/* User Profile / Auth Dropdown */}
            <div className="relative group flex items-center justify-center">
              {mounted && isLoggedIn ? (
                <>
                  <button
                    className="p-2 text-espresso hover:text-gold-bright transition-colors flex items-center justify-center"
                    aria-label="User Profile"
                  >
                    <div className="h-6 w-6 rounded-full bg-gold text-espresso flex items-center justify-center text-[14px] font-bold uppercase tracking-wider border border-gold/25 select-none">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}  
                    </div>
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gold/15 rounded-md shadow-card py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,visibility] duration-100 z-50">
                    <div className="px-4 py-2 border-b border-gold/10 text-[11px] text-sand uppercase tracking-wider">
                      Hello, <strong className="text-espresso font-bold block truncate">{user?.name}</strong>
                    </div>
                    <Link
                      href="/account?tab=settings"
                      className="w-full text-left block px-4 py-2 text-xs font-semibold text-espresso hover:bg-cream/40 hover:text-gold-bright transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      className="w-full text-left block px-4 py-2 text-xs font-semibold text-espresso hover:bg-cream/40 hover:text-gold-bright transition-colors"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/account?tab=addresses"
                      className="w-full text-left block px-4 py-2 text-xs font-semibold text-espresso hover:bg-cream/40 hover:text-gold-bright transition-colors"
                    >
                      Saved Addresses
                    </Link>
                    <button
                      onClick={signOutAction}
                      className="w-full text-left block px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-gold/5 uppercase tracking-wider"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-espresso hover:text-gold-bright transition-colors flex items-center justify-center"
                  aria-label="Login"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>

            <button
              onClick={() => cartStore.toggleOpen()}
              className="p-2 text-espresso hover:text-gold-bright transition-colors relative flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-espresso text-[9px] font-bold rounded-full h-4.5 w-4 flex items-center justify-center border border-offwhite shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mega Menu Dropdowns */}
        <AnimatePresence>
          {activeHoverTab && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full bg-white border-b border-gold/15 shadow-card-hover z-50 py-10"
              onMouseEnter={() => setActiveHoverTab(activeHoverTab)}
              onMouseLeave={() => setActiveHoverTab(null)}
            >
              <div className="max-w-7xl mx-auto px-8 grid grid-cols-12 gap-8">
                
                {/* Column 1: Women's Collection */}
                <div className="col-span-4 flex flex-col space-y-4">
                  <h4 className="text-[12px] uppercase font-bold tracking-[0.25em] text-sand border-b border-gold/10 pb-2">
                    Women's Jewellery
                  </h4>
                  <ul className="flex flex-col space-y-2.5">
                    {activeHoverTab === "silver" ? (
                      <>
                        <li>
                          <Link href="/silver?gender=women" className="text-xm font-semibold text-espresso hover:text-gold-bright transition-colors uppercase tracking-wider">All Silver Women's</Link>
                        </li>
                        <li>
                          <Link href="/silver?category=Bracelets" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Bracelets & Bangles</Link>
                        </li>
                        <li>
                          <Link href="/silver?category=Chains+%26+Pendants" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Chains & Pendants</Link>
                        </li>
                        <li>
                          <Link href="/silver?category=Earrings" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Earrings & Hoops</Link>
                        </li>
                        <li>
                          <Link href="/silver?category=Premium" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Premium Serpentine Line</Link>
                        </li>
                        <li>
                          <Link href="/silver?category=Watch+Charms" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Watch Charms</Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link href="/gold?gender=women" className="text-xm font-semibold text-espresso hover:text-gold-bright transition-colors uppercase tracking-wider">All Gold Women's</Link>
                        </li>
                        <li>
                          <Link href="/gold?category=Bracelets" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Bracelets & Chains</Link>
                        </li>
                        <li>
                          <Link href="/gold?category=Chains+%26+Pendants" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Pendants & Necklaces</Link>
                        </li>
                        <li>
                          <Link href="/gold?category=Earrings" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Earrings & Studs</Link>
                        </li>
                        <li>
                          <Link href="/gold?category=Rings" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Rings & Bands</Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Column 2: Men's Collection */}
                <div className="col-span-4 flex flex-col space-y-4">
                  <h4 className="text-[12px] uppercase font-bold tracking-[0.25em] text-sand border-b border-gold/10 pb-2">
                    Men's Jewellery
                  </h4>
                  <ul className="flex flex-col space-y-2.5">
                    {activeHoverTab === "silver" ? (
                      <>
                        <li>
                          <Link href="/silver?gender=men" className="text-xm font-semibold text-espresso hover:text-gold-bright transition-colors uppercase tracking-wider">All Silver Men's</Link>
                        </li>
                        <li>
                          <Link href="/silver?category=Men" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Rudra & Curb Bracelets</Link>
                        </li>
                        <li>
                          <Link href="/silver?category=Men&style=spiritual" className="text-xm text-sand font-medium hover:text-espresso transition-colors">Spiritual Pendants</Link>
                        </li>
                      </>
                    ) : (
                      <div className="bg-cream/30 rounded border border-gold/5 text-left flex flex-col space-y-2.5">
                        <span className="text-xm font-semibold text-espresso hover:text-gold-bright transition-colors uppercase tracking-wider">Custom Gold Line</span>
                        <p className="text-xm text-sand font-medium hover:text-espresso transition-colors">
                          Handcrafted 18K Gold Plated Men's collections are launching soon. Stay tuned!
                        </p>
                      </div>
                    )}
                  </ul>
                </div>

                {/* Column 3: Featured Visual Panel */}
                <div className="col-span-4 flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md border border-gold/10 bg-cream">
                    {activeHoverTab === "silver" ? (
                      <>
                        <Image
                          src="https://res.cloudinary.com/dhpzoucie/image/upload/v1782381966/house_of_turtles/silver/Bracelets/Aurora_Bracelet.webp"
                          alt="Aurora Collection"
                          fill
                          sizes="20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-espresso/35 flex flex-col justify-end p-4 text-white">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Featured Item</span>
                          <h5 className="font-display text-base font-semibold mt-1">The Aurora Collection</h5>
                          <Link href="/silver?category=Bracelets" className="text-[10px] uppercase font-bold tracking-wider text-gold hover:text-white mt-1.5 transition-colors">Shop Now &rarr;</Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <Image
                          src="https://res.cloudinary.com/dhpzoucie/image/upload/v1782381926/house_of_turtles/gold/Bracelets/Aanaya_Bracelet.webp"
                          alt="18K Gold plated"
                          fill
                          sizes="20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-espresso/35 flex flex-col justify-end p-4 text-white">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Featured Item</span>
                          <h5 className="font-display text-base font-semibold mt-1">18K Aanaya Gold Plated</h5>
                          <Link href="/gold?category=Bracelets" className="text-[10px] uppercase font-bold tracking-wider text-gold hover:text-white mt-1.5 transition-colors">Shop Now &rarr;</Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
          {/* Search Overlay positioned absolute top-full to prevent gap */}
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="absolute inset-x-0 top-full z-50 bg-white border-b border-gold/20 shadow-md"
            >
              <div className="max-w-4xl mx-auto flex items-center gap-4 px-6 py-4">
                <Search className="h-5 w-5 text-sand flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search jewellery by name, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  className="flex-1 text-base text-espresso bg-transparent border-none outline-none focus:ring-0 placeholder:text-sand"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-cream rounded-full transition-colors text-sand"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="p-1 hover:bg-cream rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5 text-espresso" />
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="max-w-4xl mx-auto px-6 pb-4 border-t border-gold/10">
                  <p className="text-[9px] uppercase font-bold tracking-widest text-sand py-2">
                    {searchResults.length} result{searchResults.length > 1 ? "s" : ""} — press Enter to search all
                  </p>
                  <ul className="divide-y divide-gold/5">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-4 py-2.5 hover:bg-cream/40 rounded px-2 -mx-2 transition-colors"
                        >
                          <div className="relative h-10 w-10 rounded bg-cream border border-gold/10 flex-shrink-0 overflow-hidden">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-espresso truncate">{product.name}</p>
                            <p className="text-[10px] text-sand uppercase tracking-wider">{product.metal} · {product.category}</p>
                          </div>
                          <span className="text-xs font-bold text-gold flex-shrink-0">{formatPrice(product.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div className="max-w-4xl mx-auto px-6 pb-4 border-t border-gold/10">
                  <p className="text-xs text-sand py-3 font-medium">No results for &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;
