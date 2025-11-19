"use client";
import { useEffect, useState } from "react";
import { getStoredOptions } from "@/lib/themes";

export function useAccessibilityOptions() {
  const [options, setOptions] = useState(getStoredOptions());

  useEffect(() => {
    const handleUpdate = () => {
      setOptions(getStoredOptions());
    };

    window.addEventListener("accessibilityOptionsChanged", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("accessibilityOptionsChanged", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return options;
}
