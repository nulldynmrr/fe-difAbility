"use client";

import React, { useRef } from "react";
import Button from "./Button";

export default function UploadFile({
  label,
  accept,
  multiple = false,
  onUpload,
  disabled = false,
  uploadedFiles = [],
  buttonText = "Pilih File",
  showFileName = true,
  className = "",
}) {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      if (multiple) {
        const fileArray = Array.from(files);
        await onUpload(fileArray);
      } else {
        const file = files[0];
        await onUpload(file);
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && <label className="font-medium">{label}</label>}

      <Button type="button" onClick={handleClick} disabled={disabled}>
        {buttonText}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      {showFileName && uploadedFiles.length > 0 && (
        <div className="text-sm text-green-600">
          {multiple ? (
            <span>✓ {uploadedFiles.length} file terupload</span>
          ) : (
            <span>✓ {uploadedFiles[0]}</span>
          )}
        </div>
      )}
    </div>
  );
}
