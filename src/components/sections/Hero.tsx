"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { SITE } from "@/constants/content";

/**
 * Hero Component
 * Premium landing section featuring 92.5 certified badges, CTAs, 
 * staggered text entrances, and parallax background imagery.
 */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll controls
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] md:min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-espresso"
    >
      
      {/* Left 58%: Text Content Panel */}
      <div className="w-full md:w-[58%] flex flex-col justify-center px-6 py-16 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 bg-espresso min-h-[50vh] md:min-h-screen">
        <motion.div
          variants={containerVariants}
          initial={false}
          animate="visible"
          className="space-y-6 max-w-xl"
        >
          <motion.span
            variants={fadeUpVariants}
            className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-sand"
          >
            92.5 Sterling Silver
          </motion.span>

          <motion.h1
            variants={fadeUpVariants}
            className="font-display text-4xl sm:text-5xl lg:text-display-lg xl:text-display-xl font-medium text-cream leading-[1.1] tracking-tight"
          >
            {SITE.tagline}
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="text-sm sm:text-base text-sand font-sans leading-relaxed font-light"
          >
            {SITE.description}
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link
              href="/shop"
              className="bg-gold hover:bg-gold-light text-espresso font-semibold uppercase tracking-widest text-[10px] sm:text-xs rounded-pill px-8 py-3.5 transition-colors shadow-md hover:scale-[1.01] active:scale-[0.99] duration-150"
            >
              Shop Silver
            </Link>
            <Link
              href="/shop?category=Men"
              className="border border-gold text-gold hover:bg-gold hover:text-espresso font-semibold uppercase tracking-widest text-[10px] sm:text-xs rounded-pill px-8 py-3.5 transition-[background-color,color,transform] duration-120 hover:scale-[1.01] active:scale-[0.99]"
            >
              Explore Men's
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating badge bottom-left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-6 sm:left-12 md:left-16 lg:left-24 xl:left-32 items-center gap-2 text-sand/80 select-none z-10 hidden sm:flex"
        >
          <ShieldCheck className="h-5 w-5 text-gold" />
          <span className="text-[10px] uppercase font-bold tracking-widest">
            92.5 Certified Authenticity
          </span>
        </motion.div>
      </div>

      {/* Right 42%: Visual Panel (Parallax Image) */}
      <div className="w-full md:w-[42%] h-[40vh] md:h-auto relative overflow-hidden bg-espresso">
        <motion.div 
          style={{ y }} 
          className="absolute inset-0 h-[110%] w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1200&auto=format&fit=crop"
            alt="Handcrafted premium silver jewellery display"
            fill
            priority={true}
            sizes="(max-w-768px) 100vw, 42vw"
            className="object-cover object-center"
            unoptimized={true}
          />
        </motion.div>
        {/* Subtle dark overlay gradient for mobile view */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent md:hidden" />
      </div>

    </section>
  );
}

export default Hero;
