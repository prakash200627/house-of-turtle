"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Truck, ShieldCheck, Leaf, RotateCcw } from "lucide-react";
import { TRUST_ITEMS } from "@/constants/content";

// Map icon strings to Lucide components
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck,
  ShieldCheck,
  Leaf,
  RotateCcw,
};

/**
 * TrustBar Component
 * Renders core brand security and shipping value declarations.
 * Animates in as it enters the viewport.
 */
export function TrustBar() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-espresso text-cream py-16 border-t border-gold/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0"
        >
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = IconMap[item.icon];
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="flex flex-col items-center text-center px-4 relative group"
              >
                {/* Icon */}
                <div className="mb-4 bg-white/5 p-3 rounded-full group-hover:scale-105 transition-transform duration-300">
                  {Icon && <Icon className="h-7 w-7 text-gold" />}
                </div>

                {/* Title */}
                <h3 className="font-sans font-semibold text-white text-sm tracking-wider uppercase mb-1">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] text-sand leading-relaxed">
                  {item.desc}
                </p>

                {/* Divider Line on Desktop (hidden after last item) */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-gold/20" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default TrustBar;
