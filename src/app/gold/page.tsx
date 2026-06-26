"use client";

import React from "react";
import { CollectionPageLayout } from "@/components/sections/CollectionPageLayout";

export default function GoldPage() {
  return (
    <CollectionPageLayout
      metal="gold"
      eyebrow="18K GOLD PLATED COLLECTION"
      headline="Gold that glows."
      subtext="18K gold plated over sterling silver. Lasting brilliance."
      filters={["All", "Bracelets", "Earrings", "Rings", "Sets"]}
    />
  );
}
