"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTIONS } from "@/constants/content";

/**
 * CollectionGrid Component
 * Renders editorial layout grid tiles for the silver jewellery collections.
 * Hover states reveal overlay elements and scale background images.
 */
export function CollectionGrid() {
  // Separate collections into rows based on layout specs
  const row1 = COLLECTIONS.slice(0, 2); // Bracelets (large), Chain (medium)
  const row2 = COLLECTIONS.slice(2);    // Men, Earrings, Premium, Watch Charms (small)

  return (
    <section className="bg-offwhite py-20 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="font-display text-3xl sm:text-display-md text-espresso font-medium tracking-tight">
            Crafted for every occasion
          </h2>
          <div className="h-0.5 w-16 bg-gold mt-4 mx-auto md:mx-0" />
        </div>

        {/* Layout Grid */}
        <div className="space-y-6">
          {/* Row 1: 60/40 Split */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {row1.map((col, idx) => {
              const isLarge = idx === 0;
              return (
                <Link
                  key={col.name}
                  href={col.href}
                  className={`group relative overflow-hidden rounded-card border border-gold/10 aspect-[4/3] md:aspect-auto md:h-[350px] ${
                    isLarge ? "md:col-span-3" : "md:col-span-2"
                  }`}
                >
                  <TileContent col={col} />
                </Link>
              );
            })}
          </div>

          {/* Row 2: Small grids (Men, Earrings, Premium, Charms) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {row2.map((col) => (
              <Link
                key={col.name}
                href={col.href}
                className="group relative overflow-hidden rounded-card border border-gold/10 aspect-[4/3] sm:aspect-square h-auto"
              >
                <TileContent col={col} />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// Inner helper component for clean tile animation structure
function TileContent({ col }: { col: typeof COLLECTIONS[number] }) {
  return (
    <>
      {/* Background Image with scale animation */}
      <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-105">
        <Image
          src={col.imageSrc}
          alt={col.name}
          fill
          sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
          className="object-cover"
          unoptimized={true}
        />
      </div>

      {/* Dark scrim overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent z-10" />

      {/* Hover Gold Ring Border */}
      <div className="absolute inset-0 border-0 group-hover:border-2 border-gold rounded-card transition-[border-width] duration-100 pointer-events-none z-20" />

      {/* Info Overlay */}
      <div className="absolute bottom-5 left-5 right-5 z-20 flex justify-between items-end">
        <div>
          <h3 className="font-display text-xl sm:text-heading-lg font-semibold text-white tracking-wide leading-tight">
            {col.name}
          </h3>
          {/* Shop Callout fades in on hover */}
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold opacity-0 translate-y-2 block transition-[opacity,transform] duration-150 group-hover:opacity-100 group-hover:translate-y-0 mt-1">
            Shop &rarr;
          </span>
        </div>
      </div>
    </>
  );
}

export default CollectionGrid;
