import React from "react";
import Link from "next/link";
import Image from "next/image";
import { COLLECTIONS } from "@/constants/content";
import { Collection } from "@/types";

/**
 * Collections Page
 * Renders high-quality grid cards for different jewellery collections.
 */
export default function CollectionsPage() {
  return (
    <div className="w-full bg-offwhite py-16">
      <section className="bg-cream/45 py-16 border-b border-gold/10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-espresso">
            Our Collections
          </h1>
          <p className="mt-4 text-sm sm:text-base text-sand max-w-xl mx-auto font-light leading-relaxed font-sans">
            Stories you carry. Silver that lasts. Discover handcrafted 92.5 Sterling Silver jewellery designed for every side of you.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {COLLECTIONS.map((col: Collection) => (
            <div
              key={col.name}
              className="group relative flex flex-col overflow-hidden rounded-card border border-gold/10 bg-white shadow-card hover:shadow-card-hover transition-shadow duration-150 h-full"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
                <Image
                  src={col.imageSrc}
                  alt={col.name}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[9px] font-semibold text-espresso uppercase tracking-widest bg-gold px-2.5 py-1 rounded-sm">
                    92.5 Silver
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-white mt-2">
                    {col.name}
                  </h3>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <p className="text-xs text-sand leading-relaxed mb-6 font-medium uppercase tracking-wider">
                  Hand-crafted {col.name.toLowerCase()} design
                </p>
                <Link
                  href={col.href}
                  className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-espresso hover:text-gold-bright transition-colors"
                >
                  View Collection &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
