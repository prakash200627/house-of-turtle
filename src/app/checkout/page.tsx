"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { formatPrice } from "@/lib/utils";
import {
  CreditCard,
  Truck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  QrCode,
  User,
  Mail,
  Lock,
  ShoppingBag
} from "lucide-react";

interface CheckoutFormInputs {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "upi" | "card" | "cod";
}

interface AuthFormInputs {
  email: string;
  password?: string;
  name?: string;
}

type CheckoutStep = "auth" | "shipping" | "payment" | "confirmation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { isLoggedIn, user, login, register: registerUser } = useAuthStore();
  const { addOrder } = useOrderStore();

  const [step, setStep] = useState<CheckoutStep>("auth");
  const [isGuest, setIsGuest] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderId] = useState(() => "HOT-" + Math.floor(100000 + Math.random() * 900000));
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [isAddressPrefilled, setIsAddressPrefilled] = useState(false);

  // Card payment form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardErrors, setCardErrors] = useState<{ number?: string; expiry?: string; cvv?: string }>({});

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(formatted.slice(0, 19)); // 16 digits + 3 spaces
    setCardErrors((prev) => ({ ...prev, number: "" }));
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    
    // If the user is deleting characters, just set the value and clear errors
    if (raw.length < cardExpiry.length) {
      setCardExpiry(raw);
      setCardErrors((prev) => ({ ...prev, expiry: "" }));
      return;
    }

    let clean = raw.replace(/\D/g, "");
    if (clean.length > 2) {
      clean = `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    } else if (clean.length === 2) {
      if (raw.endsWith("/")) {
        clean = `${clean}/`;
      }
    }
    
    setCardExpiry(clean.slice(0, 5)); // Limit to MM/YY
    setCardErrors((prev) => ({ ...prev, expiry: "" }));
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCardCvv(value.slice(0, 3)); // 3 digits
    setCardErrors((prev) => ({ ...prev, cvv: "" }));
  };

  const {
    register: registerCheckout,
    handleSubmit: handleSubmitCheckout,
    watch: watchCheckout,
    setValue: setValueCheckout,
    getValues: getValuesCheckout,
    formState: { errors: checkoutErrors },
  } = useForm<CheckoutFormInputs>({
    defaultValues: {
      name: user?.name || "",
      paymentMethod: "upi",
    },
  });

  const {
    register: registerAuth,
    handleSubmit: handleSubmitAuth,
    formState: { errors: authErrors, isSubmitting: isAuthSubmitting },
    reset: resetAuthForm,
  } = useForm<AuthFormInputs>();

  const paymentMethod = watchCheckout("paymentMethod");

  // Sync logged in user default address to the checkout form once
  useEffect(() => {
    if (isLoggedIn && user && !isAddressPrefilled) {
      const defaultAddress = user.addresses?.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setValueCheckout("name", defaultAddress.name);
        setValueCheckout("phone", defaultAddress.phone);
        setValueCheckout("address", defaultAddress.address);
        setValueCheckout("city", defaultAddress.city);
        setValueCheckout("state", defaultAddress.state);
        setValueCheckout("pincode", defaultAddress.pincode);
      } else if (user.name) {
        setValueCheckout("name", user.name);
      }
      setIsAddressPrefilled(true);
    }
  }, [isLoggedIn, user, setValueCheckout, isAddressPrefilled]);

  // Set initial step based on auth state
  useEffect(() => {
    if (isLoggedIn) {
      setStep("shipping");
    } else {
      setStep("auth");
    }
  }, [isLoggedIn]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingThreshold = 999;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 99;
  const total = subtotal + shippingCost;

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-sand uppercase tracking-widest font-bold mb-4">No active checkout</p>
        <h2 className="font-display text-2xl font-semibold text-espresso mb-6">Your shopping bag is empty</h2>
        <Link href="/shop" className="bg-espresso text-cream px-8 py-3.5 rounded-pill text-xs font-semibold uppercase tracking-widest hover:bg-espresso/90">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Handle Login or Register in checkout Step 1
  const onAuthSubmit = (data: AuthFormInputs) => {
    setAuthError("");
    try {
      if (authTab === "login") {
        // Mock Login
        const mockName = data.email.split("@")[0];
        const displayName = mockName.charAt(0).toUpperCase() + mockName.slice(1);
        login(displayName, data.email);
        setStep("shipping");
      } else {
        // Mock Register
        if (!data.name) {
          setAuthError("Name is required for registration");
          return;
        }
        registerUser(data.name, data.email);
        setStep("shipping");
      }
    } catch (err) {
      setAuthError("Authentication failed. Please try again.");
    }
  };

  // Continue as Guest handler
  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setStep("shipping");
  };

  const onShippingSubmit = (data: CheckoutFormInputs) => {
    setStep("payment");
  };

  const handleCompleteCheckout = () => {
    // Capture form values
    const formData = getValuesCheckout();
    
    if (formData.paymentMethod === "card") {
      const cleanNumber = cardNumber.replace(/\s+/g, "");
      const isCardValid = /^[0-9]{16}$/.test(cleanNumber);
      const isExpiryFormatValid = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpiry.trim());
      const isCvvValid = /^[0-9]{3}$/.test(cardCvv.trim());

      const errors: { number?: string; expiry?: string; cvv?: string } = {};
      if (!isCardValid) {
        errors.number = "Card number must be exactly 16 digits";
      }
      
      if (!isExpiryFormatValid) {
        errors.expiry = "Expiry must be in MM/YY format";
      } else {
        const [mStr, yStr] = cardExpiry.trim().split("/");
        const month = parseInt(mStr, 10);
        const year = parseInt(yStr, 10) + 2000;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          errors.expiry = "Card has expired";
        }
      }

      if (!isCvvValid) {
        errors.cvv = "CVV must be exactly 3 digits";
      }

      if (Object.keys(errors).length > 0) {
        setCardErrors(errors);
        return; // Stop checkout
      }
    }

    setIsVerifying(true);
    


    // Save order
    const orderItems = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      slug: item.product.slug
    }));

    addOrder({
      id: orderId,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      items: orderItems,
      subtotal,
      shipping: shippingCost,
      total,
      status: "Processing",
      paymentMethod: formData.paymentMethod === "upi" ? "UPI" : (formData.paymentMethod === "card" ? "Card" : "COD"),
      shippingAddress: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    });

    setTimeout(() => {
      setIsVerifying(false);
      setStep("confirmation");
      clearCart();
    }, 300);
  };

  // Stepper state configurations
  const stepNumber = () => {
    if (step === "auth") return 1;
    if (step === "shipping") return isLoggedIn || isGuest ? 1 : 2;
    if (step === "payment") return isLoggedIn || isGuest ? 2 : 3;
    return isLoggedIn || isGuest ? 3 : 4;
  };

  return (
    <div className="min-h-screen bg-offwhite py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Steps Header indicator */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-12 select-none">
          {/* Step 1: Account (Only if guest and not selected guest checkout yet) */}
          {!isLoggedIn && !isGuest && (
            <>
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "auth" ? "bg-espresso text-cream" : "bg-cream text-sand"
                }`}>1</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${step === "auth" ? "text-espresso" : "text-sand"}`}>Account</span>
              </div>
              <div className="h-0.5 w-6 sm:w-12 bg-gold/30" />
            </>
          )}

          {/* Step 2: Shipping */}
          <div className="flex items-center gap-2">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === "shipping" ? "bg-espresso text-cream" : (step === "payment" || step === "confirmation" ? "bg-gold text-espresso" : "bg-cream text-sand")
            }`}>{isLoggedIn || isGuest ? 1 : 2}</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${step === "shipping" ? "text-espresso" : "text-sand"}`}>Shipping</span>
          </div>
          <div className="h-0.5 w-6 sm:w-12 bg-gold/30" />

          {/* Step 3: Payment */}
          <div className="flex items-center gap-2">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === "payment" ? "bg-espresso text-cream" : (step === "confirmation" ? "bg-gold text-espresso" : "bg-cream text-sand")
            }`}>{isLoggedIn || isGuest ? 2 : 3}</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${step === "payment" ? "text-espresso" : "text-sand"}`}>Payment</span>
          </div>
          <div className="h-0.5 w-6 sm:w-12 bg-gold/30" />

          {/* Step 4: Confirmation */}
          <div className="flex items-center gap-2">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === "confirmation" ? "bg-espresso text-cream" : "bg-cream text-sand"
            }`}>{isLoggedIn || isGuest ? 3 : 4}</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${step === "confirmation" ? "text-espresso" : "text-sand"}`}>Confirmation</span>
          </div>
        </div>

        {/* Step: Confirmation (Success Screen) */}
        {step === "confirmation" && (
          <div className="max-w-md mx-auto bg-white border border-gold/15 rounded-card p-8 md:p-10 shadow-card text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-sand">Order Confirmed</span>
              <h2 className="font-display text-3xl font-bold text-espresso">
                Thank You{user?.name ? `, ${user.name}` : ""}!
              </h2>
              <p className="text-xm text-sand font-light leading-relaxed">
                Your order has been placed successfully. A confirmation email and tracking link will be sent shortly.
              </p>
            </div>
            <div className="p-4 bg-cream/35 border border-gold/10 rounded-md">
              <span className="text-[12px] font-bold uppercase tracking-wider text-sand">Order Reference</span>
              <p className="font-mono text-base font-bold text-espresso mt-0.5">{orderId}</p>
            </div>
            <Link
              href="/"
              className="w-full block bg-espresso hover:bg-espresso/90 text-cream font-semibold py-3.5 rounded-pill text-xs uppercase tracking-widest transition-colors shadow-md mt-4"
            >
              Back to Homepage
            </Link>
          </div>
        )}

        {/* Main Process Area (Step is not Confirmation) */}
        {step !== "confirmation" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Form Steps */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step: Account Authentication Tabbed Pane */}
              {step === "auth" && (
                <div className="bg-white border border-gold/15 rounded-card p-6 md:p-8 space-y-6 shadow-xs">
                  <div className="border-b border-gold/10 pb-4 mb-4 flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold text-espresso">Checkout Identity</h3>
                    <span className="text-xs text-sand font-medium uppercase tracking-wider">Step 1 of 4</span>
                  </div>

                  {/* Tabs Selector */}
                  <div className="flex border-b border-gold/10">
                    <button
                      type="button"
                      onClick={() => { setAuthTab("login"); setAuthError(""); }}
                      className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                        authTab === "login"
                          ? "border-espresso text-espresso"
                          : "border-transparent text-sand hover:text-espresso"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthTab("register"); setAuthError(""); }}
                      className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                        authTab === "register"
                          ? "border-espresso text-espresso"
                          : "border-transparent text-sand hover:text-espresso"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-semibold">
                      {authError}
                    </div>
                  )}

                  {/* Auth Form */}
                  <form onSubmit={handleSubmitAuth(onAuthSubmit)} className="space-y-4 pt-2">
                    {authTab === "register" && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-sand block">Full Name</label>
                        <div className="relative flex items-center border border-gold/25 rounded-md overflow-hidden bg-white focus-within:border-gold">
                          <span className="pl-3 text-sand"><User className="h-4 w-4" /></span>
                          <input
                            type="text"
                            placeholder="John Doe"
                            {...registerAuth("name", { required: authTab === "register" ? "Name is required" : false })}
                            className="w-full px-3 py-2.5 text-xs text-espresso focus:outline-none placeholder:text-sand/40"
                          />
                        </div>
                        {authErrors.name && <span className="text-[10px] text-red-500">{authErrors.name.message}</span>}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-sand block">Email Address</label>
                      <div className="relative flex items-center border border-gold/25 rounded-md overflow-hidden bg-white focus-within:border-gold">
                        <span className="pl-3 text-sand"><Mail className="h-4 w-4" /></span>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          {...registerAuth("email", {
                            required: "Email is required",
                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
                          })}
                          className="w-full px-3 py-2.5 text-xs text-espresso focus:outline-none placeholder:text-sand/40"
                        />
                      </div>
                      {authErrors.email && <span className="text-[10px] text-red-500">{authErrors.email.message}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-sand block">Password</label>
                      <div className="relative flex items-center border border-gold/25 rounded-md overflow-hidden bg-white focus-within:border-gold">
                        <span className="pl-3 text-sand"><Lock className="h-4 w-4" /></span>
                        <input
                          type="password"
                          placeholder="••••••••"
                          required
                          className="w-full px-3 py-2.5 text-xs text-espresso focus:outline-none placeholder:text-sand/40"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <button
                        type="button"
                        onClick={handleContinueAsGuest}
                        className="text-xs font-semibold text-espresso hover:text-gold-bright uppercase tracking-widest py-2 border-b border-dashed border-espresso hover:border-gold-bright transition-colors order-2 sm:order-1"
                      >
                        Checkout as Guest
                      </button>
                      <button
                        type="submit"
                        disabled={isAuthSubmitting}
                        className="w-full sm:w-auto bg-espresso hover:bg-espresso/90 text-cream px-8 py-3 rounded-pill text-xs font-semibold uppercase tracking-widest transition-colors shadow-md order-1 sm:order-2 flex items-center gap-2 justify-center"
                      >
                        <span>{authTab === "login" ? "Login & Continue" : "Register & Continue"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step: Shipping Address Form */}
              {step === "shipping" && (
                <form onSubmit={handleSubmitCheckout(onShippingSubmit)} className="bg-white border border-gold/15 rounded-card p-6 md:p-8 space-y-6 shadow-xs">
                  <div className="border-b border-gold/10 pb-4 mb-4 flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold text-espresso flex items-center gap-2">
                      <Truck className="h-5 w-5 text-gold" />
                      <span>Shipping Address</span>
                    </h3>
                    <span className="text-xs text-sand font-medium uppercase tracking-wider">
                      Step {isLoggedIn || isGuest ? 1 : 2} of {isLoggedIn || isGuest ? 3 : 4}
                    </span>
                  </div>

                  {isGuest && (
                    <div className="p-3 bg-cream/35 border border-gold/10 rounded-md flex justify-between items-center text-xs text-espresso font-sans">
                      <span>Checking out as <strong>Guest</strong></span>
                      <button
                        type="button"
                        onClick={() => { setIsGuest(false); setStep("auth"); }}
                        className="text-[10px] uppercase font-bold text-gold-bright hover:underline"
                      >
                        Sign in instead
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-sand">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...registerCheckout("name", { required: "Name is required" })}
                        className="w-full px-4 py-3 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                      />
                      {checkoutErrors.name && <span className="text-[10px] text-red-500 font-medium pl-1">{checkoutErrors.name.message}</span>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-sand">Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        {...registerCheckout("phone", {
                          required: "Phone is required",
                          pattern: { value: /^[0-9]{10}$/, message: "Must be a valid 10-digit mobile number" }
                        })}
                        className="w-full px-4 py-3 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                      />
                      {checkoutErrors.phone && <span className="text-[10px] text-red-500 font-medium pl-1">{checkoutErrors.phone.message}</span>}
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-sand">Flat, House, Apartment & Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Luxury Lane"
                        {...registerCheckout("address", { required: "Address is required" })}
                        className="w-full px-4 py-3 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                      />
                      {checkoutErrors.address && <span className="text-[10px] text-red-500 font-medium pl-1">{checkoutErrors.address.message}</span>}
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-sand">City</label>
                      <input
                        type="text"
                        placeholder="New Delhi"
                        {...registerCheckout("city", { required: "City is required" })}
                        className="w-full px-4 py-3 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                      />
                      {checkoutErrors.city && <span className="text-[10px] text-red-500 font-medium pl-1">{checkoutErrors.city.message}</span>}
                    </div>

                    {/* State */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-sand">State</label>
                      <input
                        type="text"
                        placeholder="Delhi"
                        {...registerCheckout("state", { required: "State is required" })}
                        className="w-full px-4 py-3 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                      />
                      {checkoutErrors.state && <span className="text-[10px] text-red-500 font-medium pl-1">{checkoutErrors.state.message}</span>}
                    </div>

                    {/* Pincode */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-sand">Pincode (ZIP)</label>
                      <input
                        type="text"
                        placeholder="110001"
                        {...registerCheckout("pincode", {
                          required: "Pincode is required",
                          pattern: { value: /^[0-9]{6}$/, message: "Must be a valid 6-digit pin code" }
                        })}
                        className="w-full px-4 py-3 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                      />
                      {checkoutErrors.pincode && <span className="text-[10px] text-red-500 font-medium pl-1">{checkoutErrors.pincode.message}</span>}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    {!isLoggedIn && (
                      <button
                        type="button"
                        onClick={() => setStep("auth")}
                        className="text-xs font-semibold uppercase tracking-widest text-espresso hover:text-gold-bright flex items-center gap-1.5"
                      >
                        <ArrowLeft className="h-4.5 w-4.5" />
                        <span>Identity Step</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-espresso hover:bg-espresso/90 text-cream px-8 py-3.5 rounded-pill text-xs font-semibold uppercase tracking-widest transition-colors shadow-md flex items-center gap-2 ml-auto"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* Step: Payment Selector */}
              {step === "payment" && (
                <div className="bg-white border border-gold/15 rounded-card p-6 md:p-8 space-y-6 shadow-xs relative">
                  {isVerifying && (
                    <div className="absolute inset-0 bg-white/85 z-40 rounded-card flex flex-col items-center justify-center space-y-4">
                      <div className="h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs uppercase font-bold tracking-widest text-espresso animate-pulse">Verifying payment details...</p>
                    </div>
                  )}

                  <div className="border-b border-gold/10 pb-4 mb-4 flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold text-espresso flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-gold" />
                      <span>Select Payment Option</span>
                    </h3>
                    <span className="text-xs text-sand font-medium uppercase tracking-wider">
                      Step {isLoggedIn || isGuest ? 2 : 3} of {isLoggedIn || isGuest ? 3 : 4}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* UPI Option */}
                    <div className="border border-gold/15 rounded p-4 flex flex-col gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          value="upi"
                          {...registerCheckout("paymentMethod")}
                          className="text-gold focus:ring-gold"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                            <QrCode className="h-4 w-4 text-gold" />
                            UPI (Instant Pay / QR Scanner)
                          </span>
                          <span className="text-[10px] text-sand mt-0.5">Pay using GPay, PhonePe, Paytm, or BHIM QR scanner</span>
                        </div>
                      </label>

                      {paymentMethod === "upi" && (
                        <div className="bg-cream/25 border border-gold/10 rounded p-6 flex flex-col items-center justify-center space-y-3">
                          <div className="relative h-40 w-40 bg-white border border-gold/25 p-2 rounded shadow-inner flex items-center justify-center">
                            <div className="h-32 w-32 border-4 border-espresso border-double p-2 flex flex-wrap items-center justify-center relative">
                              <div className="absolute top-2 left-2 h-6 w-6 border-4 border-espresso" />
                              <div className="absolute top-2 right-2 h-6 w-6 border-4 border-espresso" />
                              <div className="absolute bottom-2 left-2 h-6 w-6 border-4 border-espresso" />
                              <span className="font-display text-[9px] font-bold text-espresso uppercase tracking-widest">BHIM UPI QR</span>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-sand tracking-widest">Scan QR code using UPI App</span>
                        </div>
                      )}
                    </div>

                    {/* Card Option */}
                    <div className="border border-gold/15 rounded p-4 flex flex-col gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          value="card"
                          {...registerCheckout("paymentMethod")}
                          className="text-gold focus:ring-gold"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-espresso uppercase tracking-wider">Credit / Debit Card</span>
                          <span className="text-[10px] text-sand mt-0.5">Secure payment via Visa, Mastercard, RuPay</span>
                        </div>
                      </label>

                      {paymentMethod === "card" && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-cream/15 p-4 rounded border border-gold/10">
                          <div className="space-y-1.5 sm:col-span-3">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-sand">Card Number</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              placeholder="1234 5678 1234 5678"
                              className={`w-full px-3 py-2.5 text-xs border rounded bg-white text-espresso placeholder:text-sand/30 focus:outline-none ${
                                cardErrors.number ? "border-red-500 focus:border-red-500" : "border-gold/25 focus:border-gold"
                              }`}
                            />
                            {cardErrors.number && <span className="text-[10px] text-red-500 font-medium block mt-0.5">{cardErrors.number}</span>}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-sand">Expiry</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={handleCardExpiryChange}
                              placeholder="MM/YY"
                              className={`w-full px-3 py-2.5 text-xs border rounded bg-white text-espresso placeholder:text-sand/30 focus:outline-none ${
                                cardErrors.expiry ? "border-red-500 focus:border-red-500" : "border-gold/25 focus:border-gold"
                              }`}
                            />
                            {cardErrors.expiry && <span className="text-[10px] text-red-500 font-medium block mt-0.5">{cardErrors.expiry}</span>}
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-sand">CVV</label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={handleCardCvvChange}
                              placeholder="•••"
                              className={`w-full px-3 py-2.5 text-xs border rounded bg-white text-espresso placeholder:text-sand/30 focus:outline-none ${
                                cardErrors.cvv ? "border-red-500 focus:border-red-500" : "border-gold/25 focus:border-gold"
                              }`}
                            />
                            {cardErrors.cvv && <span className="text-[10px] text-red-500 font-medium block mt-0.5">{cardErrors.cvv}</span>}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* COD Option */}
                    <div className="border border-gold/15 rounded p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          value="cod"
                          {...registerCheckout("paymentMethod")}
                          className="text-gold focus:ring-gold"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-espresso uppercase tracking-wider">Cash On Delivery (COD)</span>
                          <span className="text-[10px] text-sand mt-0.5">Pay in cash on delivery for an extra ₹49 handling fee</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-gold/10">
                    <button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="text-xs font-semibold uppercase tracking-widest text-espresso hover:text-gold-bright flex items-center gap-1.5"
                    >
                      <ArrowLeft className="h-4.5 w-4.5" />
                      <span>Back to Address</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteCheckout}
                      className="bg-gold hover:bg-gold-light text-espresso font-semibold px-8 py-3.5 rounded-pill text-xs uppercase tracking-widest transition-colors shadow-md flex items-center gap-2"
                    >
                      <span>Complete Checkout</span>
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-gold/15 rounded-card p-6 space-y-6 shadow-xs">
                <h3 className="font-display text-xl font-bold text-espresso border-b border-gold/10 pb-3">
                  Summary
                </h3>

                {/* Items Mini-list */}
                <div className="space-y-4 max-h-56 overflow-y-auto no-scrollbar divide-y divide-gold/5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center pt-3 first:pt-0">
                      <div className="relative h-12 w-12 rounded bg-cream overflow-hidden border border-gold/10 flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized={true}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-[11px] font-semibold text-espresso truncate">{item.product.name}</h4>
                        <span className="text-[9px] font-bold text-sand uppercase tracking-wider">
                          Qty: {item.quantity} &bull; {formatPrice(item.product.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gold/10 pt-4 space-y-2.5 text-[10px] font-bold uppercase tracking-wider text-sand">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-espresso font-normal normal-case">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-espresso font-normal normal-case">
                      {isFreeShipping ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="flex justify-between">
                      <span>COD Fee</span>
                      <span className="text-espresso font-normal normal-case">₹49</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-semibold text-espresso pt-3 border-t border-gold/5">
                    <span>Total</span>
                    <span className="text-gold font-bold normal-case text-base">
                      {formatPrice(total + (paymentMethod === "cod" ? 49 : 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
