"use client";

import React from "react";
import { FAQ_ITEMS } from "@/constants/content";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";

/**
 * FAQ Component
 * Renders an accordion list of frequently asked questions with custom gold +/- toggles.
 */
export function FAQ() {
  return (
    <section className="bg-cream py-20 border-t border-gold/10">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-display-md text-espresso font-medium tracking-tight">
            Common questions
          </h2>
          <div className="h-0.5 w-16 bg-gold mt-4 mx-auto" />
        </div>

        {/* Collapsible Accordion */}
        <Accordion className="border-t border-gold/20">
          {FAQ_ITEMS.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-item-${idx}`}
              className="border-b border-gold/20"
            >
              <AccordionTrigger plusMinus className="text-sm sm:text-base font-sans font-medium text-espresso hover:text-gold-bright transition-colors py-4">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sand text-xs sm:text-sm leading-relaxed pb-4 pt-1">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </section>
  );
}

export default FAQ;
