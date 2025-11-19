"use client";

import { useEffect } from "react";
import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";

export const useShortcuts = (shortcutsMap) => {
  const { shortcuts: shortcutsEnabled } = useAccessibilityOptions();

  useEffect(() => {
    if (!shortcutsEnabled) return;

    const handleKeyDown = (event) => {
      const key = `${event.ctrlKey ? "ctrl+" : ""}${event.key.toLowerCase()}`;
      if (shortcutsMap[key]) {
        event.preventDefault();
        shortcutsMap[key]();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcutsEnabled, shortcutsMap]);
};
