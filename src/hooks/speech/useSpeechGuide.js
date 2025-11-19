"use client";

import { useEffect, useRef } from "react";

export function useSpeechGuide(message, firstInputSelector, isEnabled) {
  const lastSpokenRef = useRef("");
  const lastInputValueRef = useRef("");
  const handlersAttachedRef = useRef(false);

  useEffect(() => {
    if (!isEnabled || !message) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    function speak(text) {
      if (!text || text === lastSpokenRef.current) return;
      lastSpokenRef.current = text;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "id-ID";
      u.rate = 1;
      u.pitch = 1;
      synth.speak(u);
    }

    speak(message);

    const observer = new MutationObserver(() => {
      const firstInput = document.querySelector(firstInputSelector);
      if (firstInput && !handlersAttachedRef.current) {
        // pakai setTimeout kecil agar fokus diterima browser
        setTimeout(() => {
          focusAndSpeak(firstInput);
          setupKeyHandlers();
          setupInputChangeListeners();
          handlersAttachedRef.current = true;
        }, 50);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      synth.cancel();
      removeKeyHandlers();
      removeInputChangeListeners();
      handlersAttachedRef.current = false;
      observer.disconnect();
    };
    function focusAndSpeak(input) {
      input.focus();
      const placeholder = input.getAttribute("placeholder");
      const container = input.closest("div");
      const hasIcon = container?.querySelector("button, svg, [role='button']");
      let text = "";

      if (placeholder)
        text = `Masukkan ${placeholder}, tekan Enter untuk lanjut.`;
      if (hasIcon)
        text +=
          " Tekan Spasi untuk menekan tombol di dalam input ini, atau Enter untuk lanjut.";

      const checkbox = container?.querySelector("input[type='checkbox']");
      const label = container?.querySelector("label");
      if (checkbox && label) {
        text = label.textContent?.trim() || "";
        text += ". Gunakan Spasi untuk mencentang atau Enter untuk lanjut.";
      }

      speak(text);
    }
    function handleEnterOrSpace(e) {
      const inputs = Array.from(
        document.querySelectorAll("input, textarea, select, checkbox")
      ).filter((el) => !el.disabled && el.type !== "hidden");

      const currentIndex = inputs.indexOf(document.activeElement);
      const currentInput = inputs[currentIndex];
      const container = currentInput?.closest("div");
      const iconButton = container?.querySelector(
        "button, [role='button'], svg[onclick]"
      );

      if (e.key === " ") {
        if (iconButton) {
          e.preventDefault();
          iconButton.click();
          speak("Tombol di input ini diklik.");
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();

        // toggle checkbox jika checkbox
        if (currentInput?.type === "checkbox") {
          currentInput.checked = !currentInput.checked;
          speak(
            currentInput.checked
              ? "Centang checkbox aktif"
              : "Centang checkbox nonaktif"
          );
        }

        // cek apakah ini input terakhir sebelum submit
        const next = inputs[currentIndex + 1];
        const submitButton = Array.from(
          document.querySelectorAll("button")
        ).find((btn) => btn.type === "submit");

        if (next) {
          // jika next input ada, fokus seperti biasa
          focusAndSpeak(next);
        } else if (submitButton) {
          // fokus langsung ke tombol submit
          setTimeout(() => {
            submitButton.focus();
            const label = submitButton.textContent?.trim() || "tombol";
            speak(`Fokus pada ${label}. Tekan Enter untuk menekan tombol ini.`);

            const handleFinalEnter = (ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                submitButton.click();
                speak(`Tombol ${label} ditekan.`);
                document.removeEventListener("keydown", handleFinalEnter);
                removeKeyHandlers();
                removeInputChangeListeners();
              }
            };
            document.addEventListener("keydown", handleFinalEnter);
          }, 300);
        }
      }
    }

    function handleInputChange(e) {
      const val = e.target.value?.trim() ?? "";
      if (val && val !== lastInputValueRef.current) {
        lastInputValueRef.current = val;
      }
    }

    function setupKeyHandlers() {
      document.addEventListener("keydown", handleEnterOrSpace);
    }

    function removeKeyHandlers() {
      document.removeEventListener("keydown", handleEnterOrSpace);
    }

    function setupInputChangeListeners() {
      const inputs = document.querySelectorAll(
        "input, textarea, select, checkbox"
      );
      inputs.forEach((el) => el.addEventListener("input", handleInputChange));
    }

    function removeInputChangeListeners() {
      const inputs = document.querySelectorAll("input, textarea, select");
      inputs.forEach((el) =>
        el.removeEventListener("input", handleInputChange)
      );
    }
  }, [message, firstInputSelector, isEnabled]);
}
