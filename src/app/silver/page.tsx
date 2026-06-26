"use client";

import React from "react";
import { CollectionPageLayout } from "@/components/sections/CollectionPageLayout";

export default function SilverPage() {
  return (
    <CollectionPageLayout
      metal="silver"
      eyebrow="HANDCRAFTED SINCE DAY ONE"
      headline="Pure Silver. Pure You."
      subtext="Every piece crafted in 92.5 hallmark sterling silver."
      filters={["All", "Bracelets", "Chains & Pendants", "Earrings", "Rings", "Premium"]}
    />
  );
}
