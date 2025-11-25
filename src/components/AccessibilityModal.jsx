"use client";

import { useState, useEffect } from "react";
import { X, Type } from "lucide-react";
import { applyTheme, getStoredOptions } from "@/lib/themes";

export default function AccessibilityModal({ isOpen, onClose }) {
  const [options, setOptions] = useState({
    theme: "default",
    dyslexia: false,
    fontSize: "default",
    shortcuts: false,
    showShortcutLabels: false,
    voiceAssistant: false,
  });

  useEffect(() => {
    const storedOptions = getStoredOptions();
    setOptions({
      theme: storedOptions.theme || "default",
      dyslexia: storedOptions.dyslexia ?? false,
      fontSize: storedOptions.fontSize || "default",
      shortcuts: storedOptions.shortcuts ?? false,
      showShortcutLabels: storedOptions.showShortcutLabels ?? false,
      voiceAssistant: storedOptions.voiceAssistant ?? false,
    });
  }, [isOpen]);

  useEffect(() => {
    const handleOptionsChange = () => {
      const storedOptions = getStoredOptions();
      setOptions({
        theme: storedOptions.theme || "default",
        dyslexia: storedOptions.dyslexia ?? false,
        fontSize: storedOptions.fontSize || "default",
        shortcuts: storedOptions.shortcuts ?? false,
        showShortcutLabels: storedOptions.showShortcutLabels ?? false,
        voiceAssistant: storedOptions.voiceAssistant ?? false,
      });
    };

    window.addEventListener("accessibilityOptionsChanged", handleOptionsChange);
    return () => {
      window.removeEventListener(
        "accessibilityOptionsChanged",
        handleOptionsChange
      );
    };
  }, []);

  if (!isOpen) return null;

  const handleOptionChange = (newOptions) => {
    setOptions(newOptions);
    localStorage.setItem("accessibilityOptions", JSON.stringify(newOptions));
    applyTheme(newOptions);

    window.dispatchEvent(new Event("accessibilityOptionsChanged"));

    if (typeof window !== "undefined") {
      if (newOptions.shortcuts) {
        document.body.dataset.shortcuts = "true";
      } else {
        delete document.body.dataset.shortcuts;
      }
    }
  };

  const handleShortcutToggle = (checked) => {
    const newOptions = {
      ...options,
      shortcuts: checked,
      showShortcutLabels: checked,
    };
    handleOptionChange(newOptions);
  };

  const handleVoiceAssistToggle = (checked) => {
    const newOptions = { ...options, voiceAssistant: checked };
    handleOptionChange(newOptions);

    if (typeof window !== "undefined") {
      const synth = window.speechSynthesis;
      synth.cancel();

      const message = checked
        ? "Asisten suara diaktifkan."
        : "Asisten suara dimatikan.";

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "id-ID";
      utterance.rate = 1;
      utterance.pitch = 1;
      synth.speak(utterance);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="absolute top-0 right-0 bottom-0 w-full sm:w-[600px] bg-bg-card shadow-2xl border-l border-primary-50 flex flex-col focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-primary-50">
          <h2
            id="accessibility-title"
            className="text-xl font-semibold text-text-primary"
          >
            Accessibility Options
          </h2>
          <button
            onClick={onClose}
            aria-label="Close accessibility options"
            className="text-text-secondary hover:text-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200 rounded-full p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <p className="text-base font-medium mb-3 text-text-secondary">
              Visual Theme
            </p>
            <div
              className="grid grid-cols-1 gap-3"
              role="radiogroup"
              aria-label="Theme selection"
            >
              {[
                {
                  value: "default",
                  label: "Default",
                  desc: "Balanced color contrast",
                },
                {
                  value: "color-blind",
                  label: "Color Blind Friendly",
                  desc: "Color-safe palette",
                },
                {
                  value: "high-contrast",
                  label: "High Contrast",
                  desc: "Strong colors for visibility",
                },
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => {
                    const newOptions = {
                      ...options,
                      theme: theme.value || "default",
                    };
                    handleOptionChange(newOptions);
                  }}
                  role="radio"
                  aria-checked={(options.theme || "default") === theme.value}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all focus:outline-none ${
                    options.theme === theme.value
                      ? "border-primary-100 bg-primary-200/10"
                      : "border-border hover:border-primary-100"
                  }`}
                >
                  <span className="block text-lg font-semibold text-text-primary">
                    {theme.label}
                  </span>
                  <span className="block text-sm text-text-secondary">
                    {theme.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-base font-medium mb-3 text-text-secondary">
              Font Size
            </p>
            <div
              className="flex gap-3"
              role="radiogroup"
              aria-label="Font size selection"
            >
              {[
                { value: "default", label: "Default", iconSize: 20 },
                { value: "large", label: "Large", iconSize: 28 },
                { value: "extra-large", label: "Extra Large", iconSize: 36 },
              ].map((size) => (
                <button
                  key={size.value}
                  onClick={() => {
                    const newOptions = { ...options, fontSize: size.value };
                    handleOptionChange(newOptions);
                  }}
                  role="radio"
                  aria-checked={options.fontSize === size.value}
                  className={`flex-1 flex items-center gap-2 p-4 rounded-xl border-2 transition-all focus:outline-none ${
                    options.fontSize === size.value
                      ? "border-primary-100 bg-primary-200/10"
                      : "border-border hover:border-primary-100"
                  }`}
                >
                  <Type size={size.iconSize} className="text-text-primary" />
                  <span className="block text-lg font-semibold text-text-primary">
                    {size.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.dyslexia}
                onChange={(e) => {
                  const newOptions = { ...options, dyslexia: e.target.checked };
                  handleOptionChange(newOptions);
                }}
                className="mt-1 w-5 h-5 accent-primary-200 focus:ring-2 focus:ring-primary-100"
                aria-describedby="dyslexia-desc"
              />
              <div>
                <span className="text-base font-medium text-text-primary">
                  Dyslexia-Friendly Font
                </span>
                <p id="dyslexia-desc" className="text-sm text-text-secondary">
                  Adjusts spacing and shapes to improve readability for dyslexic
                  users.
                </p>
              </div>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.shortcuts && options.showShortcutLabels}
                onChange={(e) => handleShortcutToggle(e.target.checked)}
                className="mt-1 w-5 h-5 accent-primary-200 focus:ring-2 focus:ring-primary-100"
                aria-describedby="shortcut-desc"
              />
              <div>
                <span className="text-base font-medium text-text-primary">
                  Enable Keyboard Shortcuts & Labels
                </span>
                <p id="shortcut-desc" className="text-sm text-text-secondary">
                  Activate keyboard navigation and show shortcut hints next to
                  buttons.
                </p>
              </div>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.voiceAssistant ?? false}
                onChange={(e) => handleVoiceAssistToggle(e.target.checked)}
                className="mt-1 w-5 h-5 accent-primary-200 focus:ring-2 focus:ring-primary-100"
                aria-describedby="voice-desc"
              />
              <div>
                <span className="text-base font-medium text-text-primary">
                  Voice Assistant (Bahasa Indonesia)
                </span>
                <p id="voice-desc" className="text-sm text-text-secondary">
                  Aktifkan panduan suara dan kontrol berbasis suara.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <p className="text-sm text-text-secondary text-center">@2025</p>
        </div>
      </div>
    </div>
  );
}
