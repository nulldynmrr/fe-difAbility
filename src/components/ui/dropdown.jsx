"use client";

import { useState, useRef, useEffect } from "react";

export default function InputDropdown({
  label,
  options = [],
  value,
  onChange,
  className = "",
  error,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`w-full flex flex-col gap-1 relative mb-1 ${className}`}
    >
      {label && (
        <label className="text-sm font-medium text-primary-300">{label}</label>
      )}

      <div
        className={`border rounded-md p-2 cursor-pointer bg-bg-card text-primary-900 ${
          error ? "border-red-500" : "border-primary-100"
        }`}
        onClick={() => setOpen((p) => !p)}
      >
        {selectedOption ? selectedOption.label : "Pilih..."}
      </div>

      {open && (
        <div className="absolute z-20 w-full border border-primary-100 bg-bg-card rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 hover:bg-primary-50 cursor-pointer text-primary-900"
              onClick={(e) => {
                e.stopPropagation();
                onChange(option.value);
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
