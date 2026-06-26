import { useEffect, useState } from "react";

/**
 * Hook to detect client-side mounting
 * Prevents hydration mismatch bugs when reading persisted local storage state.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export default useMounted;
