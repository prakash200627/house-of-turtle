"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("useAccordion must be used within Accordion provider");
  return context;
}

interface AccordionProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

/**
 * Accordion component allowing collapsible content panels.
 */
export function Accordion({ children, defaultValue = "", className }: AccordionProps) {
  const [activeValue, setActiveValue] = useState<string | null>(defaultValue || null);

  return (
    <AccordionContext.Provider value={{ activeValue, setActiveValue }}>
      <div className={cn("divide-y divide-border", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const AccordionItemContext = createContext<string | undefined>(undefined);

export function useAccordionItem() {
  const value = useContext(AccordionItemContext);
  if (value === undefined) throw new Error("useAccordionItem must be used within AccordionItem");
  return value;
}

export function AccordionItem({ children, value, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn("py-4", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  plusMinus?: boolean;
}

export function AccordionTrigger({ children, className, plusMinus = false }: AccordionTriggerProps) {
  const { activeValue, setActiveValue } = useAccordion();
  const value = useAccordionItem();
  const isOpen = activeValue === value;

  const handleToggle = () => {
    setActiveValue(isOpen ? null : value);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex w-full items-center justify-between font-medium transition-all hover:no-underline text-left text-foreground py-4",
        className
      )}
    >
      <span className="font-sans font-medium text-espresso">{children}</span>
      {plusMinus ? (
        <span className="h-5 w-5 flex items-center justify-center text-gold font-bold text-lg select-none">
          {isOpen ? "−" : "+"}
        </span>
      ) : (
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform duration-120 text-gold", {
            "rotate-180": isOpen,
          })}
        />
      )}
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const { activeValue } = useAccordion();
  const value = useAccordionItem();
  const isOpen = activeValue === value;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.12, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className={cn("pt-2 pb-1 text-sm text-muted-foreground leading-relaxed", className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
