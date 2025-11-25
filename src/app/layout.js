"use client";

import { useEffect, useState } from "react";
import AccessibilityButton from "@/components/AccessibilityButton";
import AccessibilityModal from "@/components/AccessibilityModal";
import SpeechGuideProvider from "@/hooks/speech/speechGuideProvider";
import { applyTheme, getStoredOptions } from "@/lib/themes";
import "./globals.css";

export default function Layout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    const storedOptions = getStoredOptions();
    applyTheme(storedOptions);

    const handleOptionsChange = () => {
      const latestOptions = getStoredOptions();
      applyTheme(latestOptions);
    };

    window.addEventListener("accessibilityOptionsChanged", handleOptionsChange);
    return () => {
      window.removeEventListener(
        "accessibilityOptionsChanged",
        handleOptionsChange
      );
    };
  }, []);

  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        {voiceEnabled && <SpeechGuideProvider />}

        {children}

        <AccessibilityButton onClick={() => setIsModalOpen(true)} />

        <AccessibilityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onVoiceToggle={(enabled) => setVoiceEnabled(enabled)}
        />
      </body>
    </html>
  );
}
