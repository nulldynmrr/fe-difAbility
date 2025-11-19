"use client";

import { Accessibility } from "lucide-react";

export default function AccessibilityButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Open accessibility options"
      className="fixed bottom-4 right-4 w-12 h-12 
                 bg-primary-200 text-white 
                 rounded-full flex items-center justify-center 
                 shadow-lg hover:bg-primary-300
                 transition-colors focus-visible:outline-none 
                 focus-visible:ring-2 focus-visible:ring-primary-200
                 focus-visible:ring-offset-2 z-100"
    >
      <Accessibility size={24} aria-hidden="true" />
    </button>
  );
}
