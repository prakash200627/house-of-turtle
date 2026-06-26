"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/authStore";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

interface LoginFormInputs {
  email: string;
  password: string;
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { isLoggedIn, login } = useAuthStore();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirect);
    }
  }, [isLoggedIn, router, redirect]);

  const onSubmit = async (data: LoginFormInputs) => {
    setError("");
    setSuccess("");
    setIsPending(true);
    try {
      // Create a nice display name from the email
      const emailPrefix = data.email.split("@")[0];
      const displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      
      // Simulate quick API check and login via client store
      await new Promise((resolve) => setTimeout(resolve, 800));
      login(displayName, data.email);
      setSuccess("Successfully signed in!");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-lg bg-white border border-gold/15 rounded-card shadow-card-hover p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-espresso">Welcome Back</h2>
        <p className="text-xs md:text-sm text-sand font-medium uppercase tracking-wider mt-1.5">
          Sign in to your House of Turtles account
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-xs font-semibold">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] uppercase font-bold tracking-widest text-sand block">
            Email Address
          </label>
          <div className="relative flex items-center border border-gold/25 rounded-md overflow-hidden bg-white focus-within:border-gold transition-colors">
            <span className="pl-3 text-sand">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <input
              type="email"
              placeholder="you@example.com"
              disabled={isPending}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-3 py-3 md:py-3.5 text-xs md:text-sm bg-transparent border-none text-espresso focus:outline-none placeholder:text-sand/50"
            />
          </div>
          {errors.email && (
            <span className="text-[10px] text-red-500 font-medium pl-1">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] md:text-[11px] uppercase font-bold tracking-widest text-sand">
              Password
            </label>
            <a href="#" className="text-[10px] md:text-xs font-semibold text-gold hover:text-gold-bright transition-colors hover:underline">
              Forgot Password?
            </a>
          </div>
          <div className="relative flex items-center border border-gold/25 rounded-md overflow-hidden bg-white focus-within:border-gold transition-colors">
            <span className="pl-3 text-sand">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              type="password"
              placeholder="••••••••"
              disabled={isPending}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" }
              })}
              className="w-full px-3 py-3 md:py-3.5 text-xs md:text-sm bg-transparent border-none text-espresso focus:outline-none placeholder:text-sand/50"
            />
          </div>
          {errors.password && (
            <span className="text-[10px] text-red-500 font-medium pl-1">{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-espresso hover:bg-espresso/90 text-cream font-semibold py-3.5 md:py-4 rounded-pill transition-colors shadow-md flex items-center justify-center gap-2 uppercase tracking-widest text-xs md:text-sm disabled:opacity-50"
        >
          {isPending ? "Signing In..." : "Sign In"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-8 text-center border-t border-gold/10 pt-6">
        <p className="text-xs md:text-sm text-sand font-medium">
          Don&apos;t have an account?{" "}
          <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-gold hover:text-gold-bright font-bold hover:underline transition-colors">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center py-20 px-4 bg-offwhite">
      <Suspense fallback={
        <div className="text-center">
          <p className="text-xs text-sand animate-pulse font-semibold tracking-widest uppercase">Loading...</p>
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
