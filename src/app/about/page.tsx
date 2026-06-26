import React from "react";
import Image from "next/image";
import { TrustBar } from "@/components/sections/TrustBar";

/**
 * About Page
 * Tells the brand story of House of Turtles, focused on premium silver jewellery.
 */
export default function AboutPage() {
  return (
    <div className="w-full bg-offwhite">
      {/* Editorial Hero */}
      <section className="relative py-24 sm:py-32 bg-cream/45 overflow-hidden border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">
              Our Philosophy
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-espresso leading-[1.15]">
              In praise of the slow, the patient, and the permanent.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-sand font-light leading-relaxed font-sans">
              Like the sea turtle that navigates oceans with deliberate grace, we believe jewellery should be slow-crafted, meaningful, and made to last lifetimes.
            </p>
          </div>
        </div>
      </section>

      {/* Story Content & Imagery */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-offwhite">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Story Text */}
          <div className="space-y-6 text-sand leading-relaxed font-sans text-sm sm:text-base">
            <h2 className="font-display text-3xl font-semibold text-espresso">
              How We Began
            </h2>
            <p className="font-light">
              House of Turtles was founded on a simple realization: that in a world driven by fast fashion and disposable trends, the objects we carry on our skin should speak of origin, patience, and character. We wanted to build a sanctuary of pure 92.5 Sterling Silver jewellery that stands the test of time.
            </p>
            <p className="font-light">
              Every ring is shaped by master silversmiths, every chain link is meticulously connected, and every design is polished by hand in local heritage workshop clusters. We support sustainable, fair-trade craft clusters across India.
            </p>
            <h3 className="font-display text-2xl font-semibold text-espresso pt-4">
              Slow Jewellery
            </h3>
            <p className="font-light">
              We believe a sustainable future starts with conscious choices. Our Sterling Silver naturally ages with you, acquiring a beautiful, unique patina that records the stories of your days. Clean silver, ethically sourced, slow-crafted.
            </p>
          </div>

          {/* Editorial Image */}
          <div className="relative aspect-[4/5] w-full rounded-card overflow-hidden shadow-card border border-gold/10 bg-cream">
            <Image
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
              alt="Artisan silversmith handcrafting jewellery"
              fill
              sizes="(max-w-1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized={true}
            />
          </div>
        </div>
      </section>

      <TrustBar />
    </div>
  );
}
