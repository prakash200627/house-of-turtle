"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────
   Slide data
───────────────────────────────────────────── */
const SLIDES = [
  {
    id: "gold",
    eyebrow: "New Arrivals",
    heading: ["Radiant Gold", "Collection"],
    sub: "Timeless 22kt gold-plated pieces crafted for every occasion. Where luxury meets everyday elegance.",
    cta: { label: "Explore Gold", href: "/gold" },
    cta2: { label: "View All", href: "/shop" },
    badge: null,
    image: "/hero-gold.png",
    accent: "#c9a84c",
    bg: "from-[#1a0e05] via-[#2c1a08] to-[#120a02]",
  },
  {
    id: "silver",
    eyebrow: "92.5 Sterling Silver",
    heading: ["Pure Silver,", "Pure Elegance"],
    sub: "Hallmarked 92.5 sterling silver — crafted with precision and passion. Authenticity guaranteed.",
    cta: { label: "Shop Silver", href: "/silver" },
    cta2: { label: "Explore Men's", href: "/shop?category=Men" },
    badge: null,
    image: "/hero-silver.png",
    accent: "#a8b8c8",
    bg: "from-[#08101a] via-[#0d1826] to-[#050d15]",
  },
  {
    id: "sale",
    eyebrow: "Flash Sale • 48 Hrs Only",
    heading: ["Up to 30% Off", "Selected Pieces"],
    sub: "Grab our finest gold & silver pieces at unbeatable prices. Crafted with love, offered with generosity.",
    cta: { label: "Shop the Sale", href: "/shop" },
    cta2: { label: "View Collections", href: "/collections" },
    badge: "🔥 Limited Time",
    image: "/hero-sale.png",
    accent: "#f6d860",
    bg: "from-[#1a0a00] via-[#2a1000] to-[#100500]",
  },
];

const AUTO_PLAY_MS = 5000;

/* ─────────────────────────────────────────────
   Hero Carousel Component
───────────────────────────────────────────── */
export function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1=forward, -1=backward
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent((index + SLIDES.length) % SLIDES.length);
      setProgress(0);
    },
    []
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  // Auto-play + progress bar
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    setProgress(0);
    const TICK = 50;
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (TICK / AUTO_PLAY_MS) * 100, 100));
    }, TICK);

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % SLIDES.length);
      setProgress(0);
    }, AUTO_PLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = SLIDES[current];

  // Slide variants
  const EASE_SLIDE = [0.32, 0.72, 0, 1] as [number, number, number, number];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.65, ease: EASE_SLIDE },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.55, ease: EASE_SLIDE },
    }),
  };

  const EASE_TEXT = [0.16, 1, 0.3, 1] as [number, number, number, number];

  const textVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: i * 0.1, ease: EASE_TEXT },
    }),
  };

  return (
    <section
      className="relative w-full min-h-[90vh] md:min-h-screen overflow-hidden"
      aria-label="Hero carousel"
    >
      {/* ── Slide layer ── */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex flex-col md:flex-row"
        >
          {/* Left: Text */}
          <div
            className={`w-full md:w-[56%] flex flex-col justify-center px-6 py-20 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 min-h-[55vh] md:min-h-screen bg-gradient-to-br ${slide.bg}`}
          >
            {/* Badge */}
            {slide.badge && (
              <motion.div
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-1.5 self-start mb-5 px-3 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase"
                style={{
                  borderColor: `${slide.accent}60`,
                  background: `${slide.accent}18`,
                  color: slide.accent,
                }}
              >
                <Sparkles className="w-3 h-3" />
                {slide.badge}
              </motion.div>
            )}

            {/* Eyebrow */}
            <motion.span
              custom={slide.badge ? 1 : 0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4"
              style={{ color: `${slide.accent}cc` }}
            >
              {slide.eyebrow}
            </motion.span>

            {/* Headline */}
            <motion.h1
              custom={slide.badge ? 2 : 1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] font-medium text-cream leading-[1.08] tracking-tight mb-6"
            >
              {slide.heading.map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span
                      style={{
                        background: `linear-gradient(90deg, ${slide.accent}, ${slide.accent}bb)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </motion.h1>

            {/* Body */}
            <motion.p
              custom={slide.badge ? 3 : 2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-sm sm:text-base text-sand/80 font-sans leading-relaxed font-light max-w-md mb-8"
            >
              {slide.sub}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={slide.badge ? 4 : 3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href={slide.cta.href}
                className="font-semibold uppercase tracking-widest text-[10px] sm:text-xs rounded-pill px-8 py-3.5 transition-all duration-200 shadow-md hover:scale-[1.03] active:scale-[0.99]"
                style={{
                  background: slide.accent,
                  color: "#1a0e05",
                }}
              >
                {slide.cta.label}
              </Link>
              <Link
                href={slide.cta2.href}
                className="border font-semibold uppercase tracking-widest text-[10px] sm:text-xs rounded-pill px-8 py-3.5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.99]"
                style={{
                  borderColor: `${slide.accent}80`,
                  color: slide.accent,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = slide.accent;
                  (e.currentTarget as HTMLElement).style.color = "#1a0e05";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = slide.accent;
                }}
              >
                {slide.cta2.label}
              </Link>
            </motion.div>

            {/* Authenticity badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute bottom-8 left-6 sm:left-12 md:left-16 lg:left-24 xl:left-32 items-center gap-2 text-sand/60 select-none z-10 hidden sm:flex"
            >
              <ShieldCheck className="h-4 w-4" style={{ color: slide.accent }} />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                92.5 Certified Authenticity
              </span>
            </motion.div>
          </div>

          {/* Right: Image */}
          <div className="w-full md:w-[44%] h-[40vh] md:h-auto relative overflow-hidden">
            <Image
              src={slide.image}
              alt={`${slide.heading.join(" ")} – House of Turtles`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 44vw"
              className="object-cover object-center transition-transform duration-700"
              unoptimized
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${slide.bg.includes("1a0e05") ? "#1a0e05" : slide.bg.includes("08101a") ? "#08101a" : "#1a0a00"}ee 0%, transparent 30%), linear-gradient(to top, ${slide.bg.includes("1a0e05") ? "#1a0e05" : slide.bg.includes("08101a") ? "#08101a" : "#1a0a00"}cc 0%, transparent 40%)`,
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation Arrows ── */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center border border-white/15 bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 hover:border-white/30 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center border border-white/15 bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 hover:border-white/30 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Dot Indicators + Progress ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative flex items-center justify-center"
          >
            {i === current ? (
              /* Active: pill with progress */
              <div className="relative w-10 h-2 rounded-full overflow-hidden bg-white/20">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ background: slide.accent, width: `${progress}%` }}
                />
              </div>
            ) : (
              <div className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/60 transition-colors duration-200" />
            )}
          </button>
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute bottom-6 right-6 z-30 text-white/30 text-[10px] font-mono tracking-widest select-none">
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}

export default Hero;
