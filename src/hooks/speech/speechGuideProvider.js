"use client";
import { useEffect } from "react";

export default function SpeechGuideProvider() {
  useEffect(() => {
    const elements = document.querySelectorAll("input, textarea, button");

    elements.forEach((el, idx) => {
      el.addEventListener("focus", () => {
        const text = el.placeholder || el.ariaLabel || el.innerText || "";
        if (text) {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = "id-ID";
          window.speechSynthesis.speak(u);
        }
      });

      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const next = elements[idx + 1];
          if (next) next.focus();
        }
      });
    });

    return () => {
      elements.forEach((el) => {
        el.replaceWith(el.cloneNode(true));
      });
    };
  }, []);

  return null;
}
