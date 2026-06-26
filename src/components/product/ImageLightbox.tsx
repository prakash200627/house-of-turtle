"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/Dialog";

interface ImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export function ImageLightbox({
  open,
  onOpenChange,
  images,
  activeIndex,
  setActiveIndex,
}: ImageLightboxProps) {
  
  const handlePrev = () => {
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveIndex((activeIndex + 1) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, activeIndex, images.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 m-0 w-full max-w-none h-screen bg-black/90 p-0 flex items-center justify-center border-none rounded-none shadow-none z-50">
        {/* Close Button top-right */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
          aria-label="Close Lightbox"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50 hover:scale-105 active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Main Image Container */}
        <div className="relative max-w-[85vw] max-h-[80vh] w-full h-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`Product Zoomed ${activeIndex + 1}`}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="max-w-full max-h-full object-contain select-none shadow-2xl"
            />
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50 hover:scale-105 active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Counter bottom center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-sans text-[13px] font-medium tracking-wider bg-black/40 px-4 py-1.5 rounded-full select-none">
          {activeIndex + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageLightbox;
