import { useEffect } from "react";

interface GoogleTranslateProps {
  variant?: "dark" | "light";
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

const GoogleTranslate = ({ variant = "dark" }: GoogleTranslateProps) => {
  useEffect(() => {
    // Check if the widget already exists
    const existingElement = document.getElementById("google_translate_element");
    if (existingElement && existingElement.hasChildNodes()) {
      return; // Widget already initialized
    }

    // Reinitialize if needed
    if (window.google?.translate) {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "es,fr,de,it,pt,zh-CN,ja,ko",
            layout: 0, // SIMPLE layout
            autoDisplay: false,
          },
          "google_translate_element"
        );
      } catch (e) {
        // Widget might already be initialized
      }
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      className={variant === "dark" ? "google-translate-widget-dark" : "google-translate-widget"}
    />
  );
};

export default GoogleTranslate;
