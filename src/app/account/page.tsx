"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { useMounted } from "@/hooks/useMounted";
import { formatPrice } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  MapPin,
  Settings,
  LogOut,
  Trash2,
  Check,
  Package,
  ChevronRight,
  PlusCircle
} from "lucide-react";
import Image from "next/image";

type Tab = "orders" | "addresses" | "settings";

function AccountPageContent() {
  const mounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;
  const { isLoggedIn, user, signOut: logout, addAddress, removeAddress, setDefaultAddress } = useAuthStore();
  const { orders, clearOrders } = useOrderStore();
  
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  // Sync tab search parameter with activeTab state
  useEffect(() => {
    if (tabParam && ["orders", "addresses", "settings"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Address form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formPincode, setFormPincode] = useState("");
  const [formError, setFormError] = useState("");

  // Settings form states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  // Redirect to login if not logged in
  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.replace("/login?redirect=/account");
    }
  }, [mounted, isLoggedIn, router]);

  // Sync profile editing name and email
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileEmail(user.email || "");
    }
  }, [user]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-bright mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-sand font-bold">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  // Handle Add Address Submission
  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formPhone.trim() || !formAddress.trim() || !formCity.trim() || !formState.trim() || !formPincode.trim()) {
      setFormError("All address fields are required.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formPhone.trim())) {
      setFormError("Mobile number must be a valid 10-digit number.");
      return;
    }

    if (!/^[0-9]{6}$/.test(formPincode.trim())) {
      setFormError("Pincode must be a valid 6-digit number.");
      return;
    }

    try {
      addAddress({
        name: formName.trim(),
        phone: formPhone.trim(),
        address: formAddress.trim(),
        city: formCity.trim(),
        state: formState.trim(),
        pincode: formPincode.trim()
      });

      // Reset Form
      setFormName("");
      setFormPhone("");
      setFormAddress("");
      setFormCity("");
      setFormState("");
      setFormPincode("");
      setShowAddForm(false);
    } catch (err) {
      setFormError("Failed to save address. Please try again.");
    }
  };

  // Handle Profile Update simulation
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    setProfileError("");

    if (!profileName.trim() || !profileEmail.trim()) {
      return;
    }

    try {
      // Mock update in Zustand store (updates user.name and user.email)
      useAuthStore.setState((state) => {
        if (state.user) {
          return {
            user: {
              ...state.user,
              name: profileName.trim(),
              email: profileEmail.trim()
            }
          };
        }
        return {};
      });

      setProfileSuccessMsg("Profile information updated successfully!");
      setIsEditingProfile(false);
    } catch (err: any) {
      setProfileError("Failed to update profile.");
    }

    setTimeout(() => {
      setProfileSuccessMsg("");
      setProfileError("");
    }, 3000);
  };

  const savedAddresses = user?.addresses || [];

  return (
    <div className="min-h-screen bg-offwhite py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-gold/15 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gold text-espresso flex items-center justify-center text-2xl font-bold uppercase tracking-wider border border-gold/25 shadow-xs flex-shrink-0 select-none">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sand block">Dashboard</span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-espresso leading-tight">
                Welcome, {user?.name}
              </h1>
              <p className="text-xs text-sand font-light">Manage your sterling silver orders, addresses, and account options.</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="self-start md:self-auto flex items-center gap-2 bg-white hover:bg-cream/20 text-espresso border border-gold/25 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors duration-120 shadow-xs active:scale-95"
          >
            <LogOut className="h-4 w-4 text-gold-bright" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3 bg-white border border-gold/15 rounded-card p-4 shadow-card space-y-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-100 ${
                activeTab === "orders"
                  ? "bg-espresso text-cream shadow-xs"
                  : "text-espresso hover:bg-cream/40"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className={`h-4.5 w-4.5 ${activeTab === "orders" ? "text-gold-bright" : "text-sand"}`} />
                <span>Order History</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-100 ${
                activeTab === "addresses"
                  ? "bg-espresso text-cream shadow-xs"
                  : "text-espresso hover:bg-cream/40"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className={`h-4.5 w-4.5 ${activeTab === "addresses" ? "text-gold-bright" : "text-sand"}`} />
                <span>Saved Addresses</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-100 ${
                activeTab === "settings"
                  ? "bg-espresso text-cream shadow-xs"
                  : "text-espresso hover:bg-cream/40"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`h-4.5 w-4.5 ${activeTab === "settings" ? "text-gold-bright" : "text-sand"}`} />
                <span>Settings</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          </div>

          {/* Active Panel View (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* PANEL: ORDERS */}
            {activeTab === "orders" && (
              <div className="bg-white border border-gold/15 rounded-card p-6 md:p-8 shadow-card space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-espresso">Order History</h3>
                  <p className="text-xs text-sand font-light mt-0.5">Track and view details of your previous jewelry curations.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-gold/20 rounded-lg p-6 space-y-4">
                    <Package className="h-10 w-10 text-sand/50 mx-auto" />
                    <div>
                      <p className="text-espresso font-semibold text-sm">No orders found</p>
                      <p className="text-sand text-xs mt-1 leading-normal max-w-xs mx-auto">
                        Once you place an order, it will appear here with dynamic tracking options.
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="inline-block bg-espresso hover:bg-espresso/90 text-cream text-[10px] font-semibold uppercase tracking-widest px-6 py-2.5 rounded-pill transition-colors shadow-xs"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gold/15 rounded-card overflow-hidden bg-white shadow-xs">
                        {/* Order Card Header */}
                        <div className="bg-cream/25 border-b border-gold/15 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-espresso">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-sand block font-bold">Order Placed</span>
                              <span className="font-medium">{order.date}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-sand block font-bold">Total Amount</span>
                              <span className="font-bold text-gold-bright">{formatPrice(order.total)}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-sand block font-bold">Payment</span>
                              <span className="font-medium">{order.paymentMethod}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-sand block font-bold">Order Reference</span>
                              <span className="font-mono font-bold tracking-tight">{order.id}</span>
                            </div>
                          </div>
                          
                          {/* Order Status Badge */}
                          <div className="sm:self-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-250"
                                  : (order.status === "Shipped" || order.status === "Processing")
                                  ? "bg-amber-50 text-amber-700 border border-amber-250"
                                  : "bg-red-50 text-red-700 border border-red-250"
                              }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Card Contents */}
                        <div className="p-4 sm:p-6 divide-y divide-gold/5">
                          {order.items.map((item) => (
                            <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                              <div className="relative h-16 w-16 bg-cream border border-gold/10 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <Link
                                    href={`/products/${item.slug}`}
                                    className="text-xs font-semibold text-espresso hover:text-gold-bright transition-colors line-clamp-1"
                                  >
                                    {item.name}
                                  </Link>
                                  <p className="text-[10px] text-sand uppercase tracking-wider mt-0.5">
                                    Qty: {item.quantity} · {formatPrice(item.price)} each {item.size ? `· Size: ${item.size}` : ""}
                                  </p>
                                </div>
                                <div className="text-[10px] text-sand flex items-center gap-1 font-light">
                                  <span>Occasion Spec: Purity 925 Silver</span>
                                </div>
                              </div>
                              <div className="text-right self-center">
                                <span className="text-xs font-bold text-espresso">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping address recap */}
                        <div className="bg-offwhite/50 border-t border-gold/5 p-4 text-[11px] text-sand flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 font-light">
                          <div>
                            <strong>Ship To:</strong> {order.shippingAddress.name} — {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode} (Tel: {order.shippingAddress.phone})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANEL: ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="bg-white border border-gold/15 rounded-card p-6 md:p-8 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-espresso">Saved Shipping Addresses</h3>
                    <p className="text-xs text-sand font-light mt-0.5">Manage default delivery parameters for standard checkout speed.</p>
                  </div>
                  {!showAddForm && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-espresso hover:bg-espresso/90 text-cream text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-pill transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <PlusCircle className="h-4 w-4 text-gold" />
                      <span>Add New</span>
                    </button>
                  )}
                </div>

                {/* Form to Add Address */}
                {showAddForm && (
                  <form onSubmit={handleAddAddressSubmit} className="bg-cream/15 border border-gold/20 p-5 rounded-card space-y-4 shadow-inner">
                    <div className="flex justify-between items-center pb-2 border-b border-gold/10">
                      <span className="text-xs font-bold text-espresso uppercase tracking-wider">New Shipping Address</span>
                      <button
                        type="button"
                        onClick={() => { setShowAddForm(false); setFormError(""); }}
                        className="text-[10px] text-sand hover:text-espresso font-bold uppercase"
                      >
                        Cancel
                      </button>
                    </div>

                    {formError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-semibold">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-sand">Full Name</label>
                        <input
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Prakash Kumar"
                          className="w-full px-3.5 py-2.5 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-sand">Phone Number</label>
                        <input
                          type="tel"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="10-digit number"
                          className="w-full px-3.5 py-2.5 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-sand">Street Address</label>
                        <input
                          type="text"
                          value={formAddress}
                          onChange={(e) => setFormAddress(e.target.value)}
                          placeholder="Flat 101, Luxury Greens Appt"
                          className="w-full px-3.5 py-2.5 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-sand">City</label>
                        <input
                          type="text"
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          placeholder="New Delhi"
                          className="w-full px-3.5 py-2.5 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-sand">State</label>
                        <input
                          type="text"
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          placeholder="Delhi"
                          className="w-full px-3.5 py-2.5 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2 sm:max-w-xs">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-sand">Pincode (ZIP)</label>
                        <input
                          type="text"
                          value={formPincode}
                          onChange={(e) => setFormPincode(e.target.value)}
                          placeholder="110001"
                          className="w-full px-3.5 py-2.5 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none placeholder:text-sand/40"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-espresso hover:bg-espresso/90 text-cream text-[10px] font-bold uppercase tracking-widest py-3 rounded-pill transition-colors shadow-md mt-2"
                    >
                      Save Address
                    </button>
                  </form>
                )}

                {/* Addresses List */}
                {savedAddresses.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gold/20 rounded-lg p-6 space-y-2">
                    <MapPin className="h-8 w-8 text-sand/50 mx-auto" />
                    <p className="text-espresso font-semibold text-xs">No addresses saved</p>
                    <p className="text-sand text-xs leading-relaxed max-w-xs mx-auto font-light">
                      Add a shipping address so you can checkout quickly during future shopping sessions.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`border rounded-card p-5 bg-white relative flex flex-col justify-between shadow-xs transition-colors ${
                            addr.isDefault
                              ? "border-gold-bright ring-1 ring-gold-bright"
                              : "border-gold/15 hover:border-gold/30"
                          }`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-espresso block">{addr.name}</span>
                            {addr.isDefault && (
                              <span className="bg-gold-bright/10 text-gold-bright text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-gold-bright/20 flex items-center gap-0.5">
                                <Check className="h-2 w-2" /> Default
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs text-sand space-y-1 font-light leading-relaxed">
                            <p className="text-espresso">{addr.address}</p>
                            <p>{addr.city}, {addr.state} {addr.pincode}</p>
                            <p className="pt-1 text-[11px] font-medium">Mob: {addr.phone}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-5">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[10px] font-bold uppercase text-sand hover:text-gold-bright transition-colors"
                            >
                              Set as default
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold uppercase text-gold-bright italic">Default Shipping</span>
                          )}

                          <button
                            onClick={() => removeAddress(addr.id)}
                            className="text-sand hover:text-red-650 transition-colors p-1.5 rounded-full hover:bg-red-50"
                            aria-label="Delete saved address"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANEL: SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-white border border-gold/15 rounded-card p-6 md:p-8 shadow-card space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-espresso">Account Settings</h3>
                  <p className="text-xs text-sand font-light mt-0.5">Manage details relating to your login credentials and data store controls.</p>
                </div>

                {profileSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-700 rounded text-xs font-semibold flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {/* Profile Card */}
                <div className="border border-gold/15 rounded-card p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gold/5 pb-3">
                    <span className="text-xs font-bold text-espresso uppercase tracking-wider">Profile Information</span>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="text-xs font-bold text-gold-bright hover:underline"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-sm pt-2">
                      {profileError && (
                        <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-[10px] font-semibold rounded font-sans">
                          {profileError}
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-sand">Full Name</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-sand">Email Address</label>
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs border border-gold/25 rounded bg-white text-espresso focus:border-gold focus:outline-none"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-espresso hover:bg-espresso/90 text-cream text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsEditingProfile(false); setProfileName(user?.name || ""); setProfileEmail(user?.email || ""); }}
                          className="border border-gold/20 text-espresso text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-cream/10"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-sand block font-bold">Registered Name</span>
                        <span className="font-semibold text-espresso">{user?.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-sand block font-bold">Email Address</span>
                        <span className="font-semibold text-espresso">{user?.email}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-offwhite flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-bright mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-sand font-bold font-sans">Loading Profile...</p>
        </div>
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  );
}
