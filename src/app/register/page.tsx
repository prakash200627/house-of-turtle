"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterFormContent() {
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
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  // Google Sign In / Sign Up handler
  const handleGoogleSignUp = async () => {
    setIsGooglePending(true);
    try {
      await signIn("google", { callbackUrl: redirect });
    } catch (err) {
      setIsGooglePending(false);
    }
  };

  // Submit Handler
  const onSubmit = async (data: RegisterFormValues) => {
    setFormError("");
    setIsPending(true);

    try {
      // In production, you would make an API call to save user details.
      // Here we simulate registration and immediately log the user in via OTP Credentials provider.
      // Send a request to the send-otp mock to verify endpoint integrity
      const otpRes = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });

      if (!otpRes.ok) {
        const otpData = await otpRes.json();
        setFormError(otpData.error || "Failed to process registration");
        setIsPending(false);
        return;
      }

      // Simulate a quick network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Sign in the user using the Credentials provider
      const signinRes = await signIn("otp", {
        phone: `+91${data.phone}`,
        otp: "123456", // any 6-digit OTP works for credentials provider
        redirect: false,
      });

      if (signinRes?.error) {
        setFormError("Failed to log in after registration");
      } else {
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      setFormError("Registration failed. Please try again.");
    } finally {
      setIsPending(false);
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
        Create your account
      </h2>
      <p className="text-sand text-[13px] font-medium tracking-wide mt-1.5 text-center mb-8">
        Join us to track orders, manage wishlist & more.
      </p>

      {formError && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-semibold">
          {formError}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-widest text-sand block">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            disabled={isPending || isGooglePending}
            {...register("name")}
            className="w-full px-3 py-3 text-xs md:text-sm border border-sand/40 rounded-md bg-white text-espresso focus:border-espresso focus:outline-none placeholder:text-sand/50 font-medium transition-colors"
          />
          {errors.name && (
            <span className="text-[11px] text-red-500 font-semibold block pt-0.5">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-widest text-sand block">
            Email Address
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            disabled={isPending || isGooglePending}
            {...register("email")}
            className="w-full px-3 py-3 text-xs md:text-sm border border-sand/40 rounded-md bg-white text-espresso focus:border-espresso focus:outline-none placeholder:text-sand/50 font-medium transition-colors"
          />
          {errors.email && (
            <span className="text-[11px] text-red-500 font-semibold block pt-0.5">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Phone Number */}
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
              placeholder="10-digit number"
              disabled={isPending || isGooglePending}
              {...register("phone")}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                e.target.value = cleaned;
              }}
              className="w-full px-2 py-3 text-xs md:text-sm bg-transparent border-none text-espresso focus:outline-none placeholder:text-sand/50 font-medium"
            />
          </div>
          {errors.phone && (
            <span className="text-[11px] text-red-500 font-semibold block pt-0.5">
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-widest text-sand block">
            Password
          </label>
          <div className="relative flex items-center border border-sand/40 rounded-md bg-white focus-within:border-espresso transition-colors">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              disabled={isPending || isGooglePending}
              {...register("password")}
              className="w-full px-3 py-3 pr-10 text-xs md:text-sm bg-transparent border-none text-espresso focus:outline-none placeholder:text-sand/50 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-sand hover:text-espresso transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-[11px] text-red-500 font-semibold block pt-0.5">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isPending || isGooglePending}
          className="w-full bg-gold hover:bg-gold/90 text-espresso font-bold py-3.5 rounded-md transition-colors shadow-xs uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="w-full flex items-center justify-center my-6 text-sand/40 gap-3">
        <span className="h-px flex-1 bg-sand/15"></span>
        <span className="text-[11px] uppercase tracking-widest font-bold">or</span>
        <span className="h-px flex-1 bg-sand/15"></span>
      </div>

      {/* Google Sign Up Button */}
      <button
        onClick={handleGoogleSignUp}
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

      {/* Sign In Link */}
      <div className="mt-8 text-center w-full border-t border-gold/10 pt-6">
        <p className="text-xs text-sand font-medium">
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-gold hover:text-gold-bright transition-colors font-bold hover:underline"
          >
            Sign in &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Column: Image (Desktop only) - centered text alignment */}
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
          <RegisterFormContent />
        </Suspense>
      </div>
    </div>
  );
}
