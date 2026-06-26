"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ANNOUNCEMENT_MESSAGES } from "@/constants/content";

/**
 * AnnouncementBar Component
 * Displays a rotating banner of announcements with slide/fade animation.
 * Features persistent dismissal stored in localStorage.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDismissed = localStorage.getItem("announcement-dismissed") === "true";
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (dismissed || !mounted) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [dismissed, mounted]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("announcement-dismissed", "true");
    setDismissed(true);
  };

  if (!mounted || dismissed) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-espresso text-gold border-b border-gold text-center text-xs tracking-wider uppercase font-medium overflow-hidden z-50"
    >
      <div className="max-w-7xl mx-auto py-2 px-10 h-5 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="truncate select-none font-sans font-medium"
          >
            {ANNOUNCEMENT_MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gold hover:text-gold/80 transition-colors p-1"
        aria-label="Dismiss announcement"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
}

export default AnnouncementBar;
