"use client";

import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";

export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  shortcutLabel,
  className = "",
  ...props
}) {
  const { shortcuts, showShortcutLabels } = useAccessibilityOptions();

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-primary-300 mb-1">
          {label}
        </label>
      )}

      <div className="relative mb-4">
        <textarea
          {...props}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-md border border-primary-100 bg-bg-card px-4 py-2.5 text-sm text-primary-900 placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all resize-none`}
        />

        {shortcutLabel && showShortcutLabels && (
          <span
            className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono bg-bg-card border border-primary-100 rounded px-2 py-0.5 transition-opacity ${
              shortcuts ? "opacity-100" : "opacity-40"
            }`}
          >
            {shortcutLabel.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
