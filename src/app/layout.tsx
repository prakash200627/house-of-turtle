import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { AnnouncementBar, Header, CartDrawer, Footer } from "@/components/layout";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "House of Turtles | Premium 92.5 Sterling Silver Jewellery",
  description: "Handcrafted 92.5 Sterling Silver jewellery designed for every occasion. Discover our premium collection of bracelets, chains, earrings, and watch charms.",
};

/**
 * RootLayout component
 * Implements next/font for Cormorant Garamond and Jost.
 * Wraps the application with global layout components: AnnouncementBar, Header, CartDrawer, and Footer.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} scroll-smooth`}>
      <body className="font-sans bg-offwhite text-espresso antialiased min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <CartDrawer />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
