export function applyTheme(options) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const body = document.body;

  root.setAttribute("data-theme", options.theme || "default");

  if (options.dyslexia) {
    root.setAttribute("data-dyslexia", "true");
  } else {
    root.removeAttribute("data-dyslexia");
  }

  const fontSize = options.fontSize || "default";
  root.setAttribute("data-fontsize", fontSize);

  if (options.shortcuts) {
    body.dataset.shortcuts = "true";
  } else {
    delete body.dataset.shortcuts;
  }
}

export function getStoredOptions() {
  if (typeof window === "undefined") {
    return {
      theme: "default",
      dyslexia: false,
      fontSize: "default",
      shortcuts: false,
      showShortcutLabels: false,
      voiceAssistant: false,
    };
  }

  try {
    const stored = localStorage.getItem("accessibilityOptions");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        theme: parsed.theme || "default",
        dyslexia: parsed.dyslexia || false,
        fontSize: parsed.fontSize || "default",
        shortcuts: parsed.shortcuts || false,
        showShortcutLabels: parsed.showShortcutLabels || false,
        voiceAssistant: parsed.voiceAssistant || false,
      };
    }
  } catch (e) {
    console.error("Error reading accessibility options:", e);
  }

  return {
    theme: "default",
    dyslexia: false,
    fontSize: "default",
    shortcuts: false,
    showShortcutLabels: false,
    voiceAssistant: false,
  };
}
