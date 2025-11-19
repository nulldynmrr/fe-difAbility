"use client";

export function speak(text, options = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || "id-ID";
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;
  utterance.volume = options.volume || 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function startListening(callback, options = {}) {
  if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
    alert("Browser kamu belum mendukung pengenalan suara.");
    return;
  }

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = options.lang || "id-ID";
  recognition.continuous = options.continuous ?? false;
  recognition.interimResults = options.interimResults ?? false;

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    callback(result);
  };

  recognition.onerror = (err) => {
    console.error("Speech recognition error:", err);
    speak("Maaf, terjadi kesalahan saat mendengarkan.");
  };

  recognition.start();
  return recognition;
}
