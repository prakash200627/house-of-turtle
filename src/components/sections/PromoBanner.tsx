"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Timer, ArrowRight } from "lucide-react";

/**
 * PromoBanner Component
 * A rich, full-width promotional advertisement section displayed between
 * the TrustBar and FAQ sections on the homepage.
 * Features a countdown timer, animated badge, and a dismissible overlay variant.
 */
export function PromoBanner() {
  // Countdown: 48-hour sale
  const TARGET_HOURS = 48;

  const getTimeLeft = () => {
    const stored = localStorage.getItem("hot_promo_end");
    let end: number;
    if (stored) {
      end = parseInt(stored, 10);
    } else {
      end = Date.now() + TARGET_HOURS * 60 * 60 * 1000;
      localStorage.setItem("hot_promo_end", String(end));
    }
    const diff = Math.max(0, end - Date.now());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState({ hours: TARGET_HOURS, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Initialise from localStorage once mounted
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background layers */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #1a0e05 0%, #2c1a0a 40%, #1f1208 70%, #0d0704 100%)",
        }}
      />

      {/* Gold bokeh blobs */}
      <div
        className="absolute top-[-60px] left-[10%] w-72 h-72 rounded-full opacity-20 z-0 blur-3xl"
        style={{ background: "radial-gradient(circle, #c9a84c 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-40px] right-[15%] w-56 h-56 rounded-full opacity-15 z-0 blur-3xl"
        style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-[30%] right-[5%] w-32 h-32 rounded-full opacity-10 z-0 blur-2xl"
        style={{ background: "radial-gradient(circle, #b8960c 0%, transparent 70%)" }}
      />

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />


      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">

        {/* LEFT: Copy */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-5">

          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-400">
              Flash Sale • Limited Time
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-semibold leading-tight"
          >
            Up to{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(90deg, #f6d860 0%, #c9a84c 50%, #f0b429 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              30% Off
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-white/60 text-sm sm:text-base leading-relaxed max-w-sm"
          >
            On our finest gold & silver collections — crafted with intention,
            priced for the moment. Don't miss your chance.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.3 }}
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #f6d860 0%, #c9a84c 100%)",
                color: "#1a0e05",
              }}
            >
              Shop the Sale
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* DIVIDER (desktop) */}
        <div className="hidden md:block w-px h-36 bg-white/10 flex-shrink-0" />

        {/* RIGHT: Countdown Timer */}
        <div className="flex-shrink-0 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest">
            <Timer className="w-3.5 h-3.5" />
            <span>Offer ends in</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Hours */}
            <motion.div
              key={timeLeft.hours}
              initial={{ scale: 0.85, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white border border-white/10"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {pad(timeLeft.hours)}
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Hrs</span>
            </motion.div>

            <span className="text-white/30 text-2xl font-light mb-4">:</span>

            {/* Minutes */}
            <motion.div
              key={`m-${timeLeft.minutes}`}
              initial={{ scale: 0.85, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white border border-white/10"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {pad(timeLeft.minutes)}
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Min</span>
            </motion.div>

            <span className="text-white/30 text-2xl font-light mb-4">:</span>

            {/* Seconds */}
            <motion.div
              key={`s-${timeLeft.seconds}`}
              initial={{ scale: 0.85, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white border border-white/10"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {pad(timeLeft.seconds)}
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Sec</span>
            </motion.div>
          </div>

          {/* Small note */}
          <p className="text-[11px] text-white/30 tracking-wide text-center">
            Selected gold &amp; silver collections only
          </p>
        </div>

      </div>

      {/* Bottom accent border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #c9a84c 30%, #f6d860 50%, #c9a84c 70%, transparent)",
        }}
      />
    </section>
  );
}

export default PromoBanner;
