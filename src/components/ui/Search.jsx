"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/utils/request";
import { getStoredOptions } from "@/lib/themes";

export default function SpeechSearchBar({ placeholder = "Cari pekerjaan..." }) {
  const [query, setQuery] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef(null);
  const router = useRouter();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) return;

    if (voiceEnabled) {
      const u = new SpeechSynthesisUtterance("Sedang mencari pekerjaan...");
      u.lang = "id-ID";
      window.speechSynthesis.speak(u);
    }

    try {
      const res = await api.get("/jobs");
      const jobs = res.data || [];

      const matchedJob = jobs.find((job) =>
        job.title.toLowerCase().includes(query.toLowerCase())
      );

      if (matchedJob) {
        router.push(
          `/job-seeker/overview/${matchedJob.id}?title=${encodeURIComponent(
            matchedJob.title
          )}`
        );
      } else {
        alert("Job tidak ditemukan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mencari job");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-bg rounded-md border border-border/60 p-2"
    >
      <Search className="text-text-secondary mr-2" size={20} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-text-secondary outline-none focus:ring-0 border border-0"
      />
      <button
        type="button"
        onClick={handleVoiceInput}
        className="ml-2 text-text-primary"
        aria-label="Aktifkan pencarian suara"
      >
        <Mic size={20} />
      </button>
      <Button type="submit">Cari</Button>
    </form>
  );
}
