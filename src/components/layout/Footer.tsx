"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Send, Check } from "lucide-react";
import { SITE, FOOTER_LINKS } from "@/constants/content";

interface FormData {
  email: string;
}

/**
 * Footer Component
 * Custom newsletter input form using React Hook Form.
 * Multi-column navigation links, social icons, and payment badges.
 */
export function Footer() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer className="bg-espresso text-cream pt-16 pb-8 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Email Capture Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gold/10 pb-12 gap-6">
          <div className="max-w-md">
            <h3 className="font-display text-2xl font-bold tracking-wide text-white">
              Join the Turtle Club
            </h3>
            <p className="text-sand text-xs uppercase tracking-wider mt-1">
              Sign up for 10% off your first order & exclusive launches
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[350px]">
            <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-1 w-full">
              <div className="flex w-full items-center border border-cream/30 rounded-pill overflow-hidden bg-espresso focus-within:border-gold transition-colors">
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Please enter a valid email address",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  className="w-full px-5 py-3 text-xs bg-transparent border-none text-cream focus:outline-none placeholder:text-sand/70"
                />
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold-light text-espresso px-5 py-3.5 flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  {submitted ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              {errors.email && (
                <span className="text-[10px] text-red-400 pl-4">{errors.email.message}</span>
              )}
              {submitted && (
                <span className="text-[10px] text-gold pl-4">Thank you for joining! Check your inbox.</span>
              )}
            </form>
          </div>
        </div>

        {/* 4-Column Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="font-display text-xl font-bold tracking-widest text-white">
              {SITE.name}
            </h4>
            <p className="text-xs text-sand leading-relaxed max-w-xs">
              {SITE.description}
            </p>
            <p className="text-xs text-sand font-medium uppercase tracking-widest pt-1">
              {SITE.tagline}
            </p>
          </div>

          {/* Col 2: Shop Links */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-4">
              Shop
            </h5>
            <ul className="space-y-2 text-xs text-sand font-medium">
              {FOOTER_LINKS.Shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Help Links */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-4">
              Help
            </h5>
            <ul className="space-y-2 text-xs text-sand font-medium">
              {FOOTER_LINKS.Help.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company Links */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-4">
              Company
            </h5>
            <ul className="space-y-2 text-xs text-sand font-medium">
              {FOOTER_LINKS.Company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href={SITE.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors"
                >
                  <svg className="h-4.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span>Instagram</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright + Payment Badges */}
        <div className="border-t border-gold/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-sand select-none">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 select-none">
            <span className="text-[9px] font-medium tracking-wider uppercase text-sand/60 px-2 py-0.5 border border-sand/20 rounded">
              UPI
            </span>
            <span className="text-[9px] font-medium tracking-wider uppercase text-sand/60 px-2 py-0.5 border border-sand/20 rounded">
              Visa
            </span>
            <span className="text-[9px] font-medium tracking-wider uppercase text-sand/60 px-2 py-0.5 border border-sand/20 rounded">
              Mastercard
            </span>
            <span className="text-[9px] font-medium tracking-wider uppercase text-sand/60 px-2 py-0.5 border border-sand/20 rounded">
              RuPay
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
