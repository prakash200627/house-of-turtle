"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { STYLE_OCCASIONS } from "@/constants/content";

/**
 * StyleGuide Component
 * Displays jewellery looks curated for different occasions.
 * Renders as a 5-column grid on desktop and horizontally scrolls on mobile.
 */
export function StyleGuide() {
  return (
    <section className="bg-cream py-20 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl sm:text-display-md text-espresso font-medium tracking-tight">
            For every you
          </h2>
          <p className="text-xs text-sand uppercase tracking-wider mt-2 font-semibold">
            Silver jewellery styled for life's moments
          </p>
          <div className="h-0.5 w-16 bg-gold mt-4 mx-auto" />
        </div>

        {/* Scrollable Container / Grid */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-6 no-scrollbar pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {STYLE_OCCASIONS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group min-w-[200px] sm:min-w-[240px] md:min-w-0 flex flex-col items-center flex-shrink-0"
            >
              {/* Card wrapper */}
              <div className="relative aspect-square w-full rounded-card overflow-hidden border border-gold/5 bg-white shadow-sm transition-[box-shadow,transform] duration-150 group-hover:shadow-card group-hover:scale-[1.01]">
                
                {/* Image */}
                <Image
                  src={item.imageSrc}
                  alt={`${item.label} jewellery style`}
                  fill
                  sizes="(max-w-768px) 50vw, 20vw"
                  className="object-cover"
                  unoptimized={true}
                />

                {/* Gold ring border on hover */}
                <div className="absolute inset-0 border-0 group-hover:border-2 border-gold-bright rounded-card transition-[border-width] duration-100 pointer-events-none" />
              </div>

              {/* Label */}
              <span className="mt-4 font-sans font-medium text-sm text-espresso group-hover:text-gold-bright transition-colors tracking-wide text-center">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default StyleGuide;
