"use client";

import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";
import { speak } from "@/hooks/speech/voiceUtils";

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  shortcutLabel,
  voiceLabel,
  autoSpeak = false,
  ...props
}) {
  const { shortcuts, showShortcutLabels } = useAccessibilityOptions();

  const baseClass = variant === "primary" ? "btn-primary" : "btn-secondary";

  const handleFocus = () => {
    if (voiceLabel) speak(`Tombol ${voiceLabel}`);
  };

  if (autoSpeak && voiceLabel) {
    setTimeout(() => {
      speak(`Tombol ${voiceLabel}`);
    }, 400);
  }

  return (
    <button
      onClick={onClick}
      onFocus={handleFocus}
      className={`${baseClass} ${className} relative flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary-100`}
      aria-label={voiceLabel || children}
    >
      {children}

      {shortcutLabel && showShortcutLabels && (
        <span
          className={`absolute right-3 text-xs font-mono border border-border rounded px-2 py-0.5
      transition-opacity ${shortcuts ? "opacity-100" : "opacity-40"}`}
        >
          {shortcutLabel.toUpperCase()}
        </span>
      )}
    </button>
  );
}
