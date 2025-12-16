"use client";

import { useState, useRef, useEffect } from "react";

export default function CheckboxDropdown({
  label,
  options = [],
  value = [],
  onChange,
  className = "",
  error,
  placeholder = "Pilih...",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleOption = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div
      className={`w-full flex flex-col gap-1 relative ${className}`}
      ref={dropdownRef}
    >
      {label && (
        <label className="text-sm font-medium text-primary-300">{label}</label>
      )}

      <div
        className={`border rounded-md p-2 cursor-pointer bg-bg-card text-primary-900 ${
          error ? "border-red-500" : "border-primary-100"
        }`}
        onClick={() => setOpen(!open)}
      >
        {value.length > 0
          ? options
              .filter((o) => value.includes(o.value))
              .map((o) => o.label)
              .join(", ")
          : placeholder}
      </div>

      {open && (
        <div className="absolute z-10 w-full border border-primary-100 bg-bg-card rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-primary-50 text-primary-900"
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => toggleOption(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
