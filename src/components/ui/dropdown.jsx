"use client";

import { useState } from "react";

export default function InputDropdown({
  label,
  options = [],
  value,
  onChange,
  shortcutLabel,
  className = "",
  error,
}) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className={`w-full flex flex-col gap-1 relative ${className}`}>
      {label && (
        <label className="text-sm font-medium text-primary-300">{label}</label>
      )}

      <div
        className={`border rounded-md p-2 cursor-pointer bg-bg-card text-primary-900 ${
          error ? "border-red-500" : "border-primary-100"
        }`}
        onClick={() => setOpen(!open)}
      >
        {selectedOption ? selectedOption.label : "Pilih..."}
      </div>

      {open && (
        <div className="absolute z-10 w-full border border-primary-100 bg-bg-card rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 hover:bg-primary-50 cursor-pointer text-primary-900"
              onClick={() => {
                onChange(option.value); // value kapital dikirim ke BE
                setOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
