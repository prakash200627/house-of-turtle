"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/authStore";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { isLoggedIn, register: registerUser } = useAuthStore();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirect);
    }
  }, [isLoggedIn, router, redirect]);

  const onSubmit = async (data: RegisterFormInputs) => {
    setError("");
    setSuccess("");
    setIsPending(true);
    
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setIsPending(false);
      return;
    }

    try {
      // Simulate quick registration check
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      registerUser(data.name, data.email);
      setSuccess("Account created successfully!");
    } catch (err) {
      setError("Registration failed. Please try again.");
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-lg bg-white border border-gold/15 rounded-card shadow-card-hover p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-espresso">Join the Club</h2>
        <p className="text-xs md:text-sm text-sand font-medium uppercase tracking-wider mt-1.5">
          Create your House of Turtles account
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
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] uppercase font-bold tracking-widest text-sand block">
            Full Name
          </label>
          <div className="relative flex items-center border border-gold/25 rounded-md overflow-hidden bg-white focus-within:border-gold transition-colors">
            <span className="pl-3 text-sand">
              <User className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              placeholder="Your Name"
              disabled={isPending}
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-3 md:py-3.5 text-xs md:text-sm bg-transparent border-none text-espresso focus:outline-none placeholder:text-sand/50"
            />
          </div>
          {errors.name && (
            <span className="text-[10px] text-red-500 font-medium pl-1">{errors.name.message}</span>
          )}
        </div>

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
          <label className="text-[10px] md:text-[11px] uppercase font-bold tracking-widest text-sand block">
            Password
          </label>
          <div className="relative flex items-center border border-gold/25 rounded-md overflow-hidden bg-white focus-within:border-gold transition-colors">
            <span className="pl-3 text-sand">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              type="password"
              placeholder="Create Password (Min 6 Characters)"
              disabled={isPending}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              className="w-full px-3 py-3 md:py-3.5 text-xs md:text-sm bg-transparent border-none text-espresso focus:outline-none placeholder:text-sand/50"
            />
          </div>
          {errors.password && (
            <span className="text-[10px] text-red-500 font-medium pl-1">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] uppercase font-bold tracking-widest text-sand block">
            Confirm Password
          </label>
          <div className="relative flex items-center border border-gold/25 rounded-md overflow-hidden bg-white focus-within:border-gold transition-colors">
            <span className="pl-3 text-sand">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              type="password"
              placeholder="Confirm Password"
              disabled={isPending}
              {...register("confirmPassword", {
                required: "Confirm Password is required",
              })}
              className="w-full px-3 py-3 md:py-3.5 text-xs md:text-sm bg-transparent border-none text-espresso focus:outline-none placeholder:text-sand/50"
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-[10px] text-red-500 font-medium pl-1">{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            required
            disabled={isPending}
            className="mt-0.5 rounded border-gold/30 text-gold focus:ring-gold"
          />
          <span className="text-[11px] md:text-xs text-sand font-medium leading-tight">
            I agree to the House of Turtles Terms of Service and Privacy Policy.
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-espresso hover:bg-espresso/90 text-cream font-semibold py-3.5 md:py-4 rounded-pill transition-colors shadow-md flex items-center justify-center gap-2 uppercase tracking-widest text-xs md:text-sm disabled:opacity-50"
        >
          {isPending ? "Creating Account..." : "Create Account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-8 text-center border-t border-gold/10 pt-6">
        <p className="text-xs md:text-sm text-sand font-medium">
          Already have an account?{" "}
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-gold hover:text-gold-bright transition-colors font-bold hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center py-20 px-4 bg-offwhite">
      <Suspense fallback={
        <div className="text-center">
          <p className="text-xs text-sand animate-pulse font-semibold tracking-widest uppercase">Loading...</p>
        </div>
      }>
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
