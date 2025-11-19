"use client";
import { useState, useEffect, useRef } from "react";
import { Mic, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { getStoredOptions } from "@/lib/themes";

export default function SpeechSearchBar({ placeholder = "Cari pekerjaan..." }) {
  const [query, setQuery] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef(null);

  // 🔄 Sinkronisasi otomatis dengan setting Accessibility
  useEffect(() => {
    const options = getStoredOptions();
    setVoiceEnabled(options.voiceAssistant ?? false);

    const handleStorageChange = () => {
      const updated = getStoredOptions();
      setVoiceEnabled(updated.voiceAssistant ?? false);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Browser kamu belum mendukung pengenalan suara.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "id-ID";
    recognition.start();

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setQuery(result);

      if (voiceEnabled) {
        const u = new SpeechSynthesisUtterance(`Kamu bilang: ${result}`);
        u.lang = "id-ID";
        window.speechSynthesis.speak(u);
      }
    };

    recognitionRef.current = recognition;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (voiceEnabled) {
      const u = new SpeechSynthesisUtterance("Sedang mencari pekerjaan...");
      u.lang = "id-ID";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-gray-50 rounded-md border border-gray-300 p-2"
    >
      <Search className="text-blue-900 mr-2" size={20} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-blue-900"
      />

      <button
        type="button"
        onClick={handleVoiceInput}
        className="ml-2 text-blue-900"
        aria-label="Aktifkan pencarian suara"
      >
        <Mic size={20} />
      </button>

      <Button type="submit">Cari</Button>
    </form>
  );
}
