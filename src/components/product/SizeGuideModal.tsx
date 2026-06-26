"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

interface SizeGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SizeGuideModal({ open, onOpenChange }: SizeGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border border-gold/15 p-6 rounded-xl shadow-2xl">
        <DialogHeader className="border-b border-gold/15 pb-4 mb-4">
          <DialogTitle className="text-xl font-display font-bold text-espresso uppercase tracking-wider text-center">
            Jewellery Size Guide
          </DialogTitle>
        </DialogHeader>

        {/* Size Guide Table */}
        <div className="overflow-x-auto my-4 rounded-lg border border-gold/15">
          <table className="min-w-full divide-y divide-gold/15 text-xs text-espresso text-center">
            <thead className="bg-cream/20 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 border-r border-gold/15">Size</th>
                <th className="px-4 py-3 border-r border-gold/15">Wrist Circumference</th>
                <th className="px-4 py-3">Fits Wrist Up To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/15 font-sans">
              <tr>
                <td className="px-4 py-3 font-semibold border-r border-gold/15 bg-cream/10">S</td>
                <td className="px-4 py-3 border-r border-gold/15">14–15cm</td>
                <td className="px-4 py-3">15cm</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold border-r border-gold/15 bg-cream/10">M</td>
                <td className="px-4 py-3 border-r border-gold/15">16–17cm</td>
                <td className="px-4 py-3">17cm</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold border-r border-gold/15 bg-cream/10">L</td>
                <td className="px-4 py-3 border-r border-gold/15">18–19cm</td>
                <td className="px-4 py-3">19cm</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Note block */}
        <p className="text-[11px] text-sand leading-relaxed italic text-center font-sans">
          Measure your wrist with a soft tape. Add 1–2cm for comfort.
        </p>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 border border-gold text-gold hover:bg-cream/15 text-xs font-bold uppercase tracking-widest rounded-pill transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SizeGuideModal;
