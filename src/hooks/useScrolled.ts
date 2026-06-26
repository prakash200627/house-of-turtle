import { useState, useEffect } from "react";

/**
 * useScrolled hook
 * Returns true when the window scroll position is greater than 60px.
 * Used for header transparency transitions.
 */
export function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    // Check scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
}
export default useScrolled;
