"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ status: "success" | "error"; msg: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  // useRef to prevent re-checking the same pincode twice in a row
  const lastCheckedPincode = useRef("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const trimmed = pincode.trim();

    // Validation: must be exactly 6 digits
    if (!/^[0-9]{6}$/.test(trimmed)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    // Check if we are re-checking the same pincode
    if (trimmed === lastCheckedPincode.current && lastCheckedPincode.current !== "") {
      // Re-use last result if checked
      if (lastCheckedPincode.current.startsWith("9") || lastCheckedPincode.current.startsWith("0")) {
        setResult({ status: "error", msg: "✗ Delivery not available to this pincode" });
      } else if (/[7-8]/.test(lastCheckedPincode.current[0])) {
        setResult({ status: "success", msg: "✓ Delivers in 5–7 business days · Free shipping" });
      } else {
        setResult({ status: "success", msg: "✓ Delivers in 3–5 business days · Free shipping" });
      }
      return;
    }

    setIsPending(true);

    try {
      // Simulate 800ms API latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const firstDigit = trimmed[0];
      lastCheckedPincode.current = trimmed;

      if (firstDigit === "9" || firstDigit === "0") {
        setResult({
          status: "error",
          msg: "✗ Delivery not available to this pincode",
        });
      } else if (firstDigit === "7" || firstDigit === "8") {
        setResult({
          status: "success",
          msg: "✓ Delivers in 5–7 business days · Free shipping",
        });
      } else {
        setResult({
          status: "success",
          msg: "✓ Delivers in 3–5 business days · Free shipping",
        });
      }
    } catch (err) {
      setError("Failed to check delivery. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="pt-6 border-t border-gold/10 space-y-3 font-sans">
      <label className="text-[13px] font-medium tracking-wide text-espresso block">
        Check delivery
      </label>
      
      <form onSubmit={handleCheck} className="flex gap-2 max-w-sm">
        <input
          type="text"
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setPincode(val.slice(0, 6));
            setError("");
          }}
          disabled={isPending}
          placeholder="Enter pincode"
          className="flex-1 px-4 py-2.5 text-xs md:text-sm border border-gold/25 rounded-md bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-5 border border-gold text-gold hover:bg-cream/15 font-bold uppercase tracking-wider text-xs rounded-md transition-colors flex items-center justify-center min-w-[80px]"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </button>
      </form>

      {/* Errors */}
      {error && (
        <p className="text-[12px] text-red-500 font-semibold pl-1">
          {error}
        </p>
      )}

      {/* Result feedback */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`text-xs font-bold pl-1 ${
              result.status === "success" ? "text-emerald-650" : "text-red-500"
            }`}
          >
            {result.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PincodeChecker;
