"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ANNOUNCEMENT_MESSAGES } from "@/constants/content";

/**
 * AnnouncementBar Component
 * Displays a rotating banner of announcements with slide/fade animation.
 * Features persistent dismissal stored in localStorage.
 * Integrates a live countdown timer for one of the messages.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown timer logic
  useEffect(() => {
    setMounted(true);
    const isDismissed = localStorage.getItem("announcement-dismissed") === "true";
    if (isDismissed) {
      setDismissed(true);
    }

    // Get or initialize target time (72 hours from first render)
    let savedTarget = localStorage.getItem("announcement-target-time");
    let targetTime: number;

    if (savedTarget) {
      targetTime = parseInt(savedTarget, 10);
    } else {
      targetTime = Date.now() + 72 * 60 * 60 * 1000;
      localStorage.setItem("announcement-target-time", targetTime.toString());
    }

    const updateTimer = () => {
      const difference = targetTime - Date.now();
      if (difference <= 0) {
        setTimeLeft("00h : 00m : 00s");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const hStr = hours.toString().padStart(2, "0");
      const mStr = minutes.toString().padStart(2, "0");
      const sStr = seconds.toString().padStart(2, "0");

      setTimeLeft(`${hStr}h : ${mStr}m : ${sStr}s`);
    };

    updateTimer(); // initial run
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Rotate banner messages every 5 seconds
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

  // Decide what to display for message at index 1 (the middle message)
  const getMessageContent = (msgIdx: number) => {
    if (msgIdx === 1) {
      if (timeLeft === "00h : 00m : 00s") {
        return "Sale Extended! Shop now →";
      }
      return (
        <span className="flex items-center justify-center gap-1.5">
          <span>Sale ends in</span>
          <span className="font-mono bg-cream/15 px-2 py-0.5 rounded text-gold font-bold">
            {timeLeft}
          </span>
        </span>
      );
    }
    return ANNOUNCEMENT_MESSAGES[msgIdx];
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-espresso text-gold border-b border-gold text-center text-xs tracking-wider uppercase font-medium overflow-hidden z-50 animate-fade-in"
    >
      <div className="max-w-7xl mx-auto py-2 px-10 h-8 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="truncate select-none font-sans font-medium"
          >
            {getMessageContent(index)}
          </motion.div>
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
