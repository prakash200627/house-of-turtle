"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(redirect);
    }
  }, [isLoggedIn, redirect, router]);

  // State Management
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  // Focus refs for OTP boxes
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, cooldown]);

  // Google Sign In handler
  const handleGoogleSignIn = async () => {
    setIsGooglePending(true);
    try {
      await signIn("google", { callbackUrl: redirect });
    } catch (err) {
      setIsGooglePending(false);
    }
  };

  // Step A: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    const sanitizedPhone = phone.trim();
    if (!/^[0-9]{10}$/.test(sanitizedPhone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsPending(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: sanitizedPhone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPhoneError(data.error || "Failed to send OTP. Please try again.");
        setIsPending(false);
        return;
      }

      // Simulate 800ms loading before transition
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStep("otp");
      setCooldown(30);
    } catch (err) {
      setPhoneError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  // Step B: Verify OTP & Sign In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setOtpError("Please enter the 6-digit OTP code");
      return;
    }

    setIsPending(true);

    try {
      // First hit mock OTP verification API
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}`, otp: otpString }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setOtpError(verifyData.error || "Verification failed");
        setIsPending(false);
        return;
      }

      // NextAuth Credentials verification
      const res = await signIn("otp", {
        phone: `+91${phone}`,
        otp: otpString,
        redirect: false,
      });

      if (res?.error) {
        setOtpError("Invalid OTP. Please try again.");
      } else {
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setOtpError("");
    setIsPending(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        setCooldown(30);
        setOtp(Array(6).fill(""));
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      } else {
        const data = await res.json();
        setOtpError(data.error || "Failed to resend OTP");
      }
    } catch (err) {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  // OTP inputs key events handlers
  const handleOtpChange = (index: number, val: string) => {
    const newVal = val.replace(/[^0-9]/g, "").slice(-1);
    const updated = [...otp];
    updated[index] = newVal;
    setOtp(updated);

    if (newVal && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const updated = [...otp];
        updated[index - 1] = "";
        setOtp(updated);
        otpRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const updated = [...otp];
        updated[index] = "";
        setOtp(updated);
      }
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      {/* Small Centered Logo */}
      <div className="mb-8 flex justify-center">
        <Link href="/">
          <span className="font-display text-2xl font-bold tracking-wider text-espresso uppercase">
            House of Turtles
          </span>
        </Link>
      </div>

      {/* Headings */}
      <h2 className="font-display text-[28px] font-bold text-espresso text-center">
        Welcome back
      </h2>
      <p className="text-sand text-[13px] font-medium tracking-wide mt-1.5 text-center mb-8">
        Sign in to track orders, manage wishlist & more.
      </p>

      {/* 1. Google Sign In Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isGooglePending || isPending}
        className="w-full flex items-center justify-center gap-3 bg-white border border-sand hover:bg-neutral-50 text-espresso font-semibold py-3 px-4 rounded-md transition-colors text-xs md:text-sm disabled:opacity-50"
      >
        {isGooglePending ? (
          <Loader2 className="h-4.5 w-4.5 animate-spin text-sand" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8.005 12.5a5.99 5.99 0 0 1 5.986-6.014c1.55 0 2.902.573 3.96 1.509l3.057-3.057C19.16 3.119 16.7 2 13.99 2A10.5 10.5 0 0 0 3.5 12.5a10.5 10.5 0 0 0 10.49 10.5c5.82 0 10.2-4.09 10.2-10.386 0-.614-.078-1.077-.18-1.329H12.24Z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      {/* 2. Divider */}
      <div className="w-full flex items-center justify-center my-6 text-sand/40 gap-3">
        <span className="h-px flex-1 bg-sand/15"></span>
        <span className="text-[11px] uppercase tracking-widest font-bold">or</span>
        <span className="h-px flex-1 bg-sand/15"></span>
      </div>

      {/* 3. Phone OTP Flow */}
      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-sand block">
              Phone Number
            </label>
            <div className="flex items-center border border-sand/40 rounded-md overflow-hidden bg-white focus-within:border-espresso transition-colors">
              <span className="pl-3 text-sm font-semibold text-sand select-none pr-1">
                +91
              </span>
              <input
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                disabled={isPending || isGooglePending}
                className="w-full px-2 py-3 text-xs md:text-sm bg-transparent border-none text-espresso focus:outline-none placeholder:text-sand/50 font-medium"
              />
            </div>
            {phoneError && (
              <span className="text-[11px] text-red-500 font-semibold block pt-0.5">
                {phoneError}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || isGooglePending}
            className="w-full bg-gold hover:bg-gold/90 text-espresso font-bold py-3.5 rounded-md transition-colors shadow-xs uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="w-full space-y-5">
          <div className="space-y-2 text-center">
            <p className="text-[13px] text-sand font-medium">
              OTP sent to <span className="font-semibold text-espresso">+91 {phone.slice(0,5)} {phone.slice(5)}</span>
            </p>
            <p className="text-[11px] text-gold font-semibold bg-gold/10 py-1.5 px-3 rounded border border-gold/20 inline-block">
              Demo mode: enter any 6-digit code (e.g. 123456)
            </p>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="text-[11px] text-gold hover:underline font-semibold block mx-auto mt-2"
            >
              Change number
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between gap-2 max-w-xs mx-auto">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  disabled={isPending}
                  className="w-12 h-12 text-center text-lg font-bold border border-sand/40 rounded-md focus:border-espresso focus:ring-1 focus:ring-espresso focus:outline-none bg-white text-espresso transition-all"
                />
              ))}
            </div>
            {otpError && (
              <span className="text-[11px] text-red-500 font-semibold block text-center pt-1">
                {otpError}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || isGooglePending}
            className="w-full bg-gold hover:bg-gold/90 text-espresso font-bold py-3.5 rounded-md transition-colors shadow-xs uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="text-center">
            {cooldown > 0 ? (
              <p className="text={11px} text-sand font-medium">
                Resend OTP in <span className="font-semibold">{cooldown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isPending}
                className="text-[12px] text-gold hover:underline font-bold transition-all disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      )}

      {/* 4. Register Link */}
      <div className="mt-8 text-center w-full border-t border-gold/10 pt-6">
        <p className="text-xs text-sand font-medium">
          New here?{" "}
          <Link
            href={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-gold hover:text-gold-bright transition-colors font-bold hover:underline"
          >
            Create account &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Column: Image (Desktop only) - aligned text to center */}
      <div className="hidden lg:block lg:w-1/2 relative h-screen">
        <Image
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop"
          alt="Elegant Jewellery Lifestyle"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-espresso/20 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
          <div className="max-w-md text-center text-cream flex flex-col items-center">
            <span className="text-[12px] uppercase font-bold tracking-[0.2em] text-gold">
              HANDCRAFTED SINCE DAY ONE
            </span>
            <h1 className="font-display text-5xl font-semibold mt-3 mb-4 leading-tight">
              Stories you carry. Silver that lasts.
            </h1>
            <p className="text-sm text-cream/80 leading-relaxed font-light">
              Experience the pure brilliance of 92.5 sterling silver and 18K gold plating.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 bg-offwhite flex items-center justify-center p-8 md:p-12 overflow-y-auto">
        <Suspense
          fallback={
            <div className="text-center flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
              <p className="text-xs text-sand animate-pulse font-semibold tracking-widest uppercase">
                Loading...
              </p>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
