import { useEffect, useRef } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout: number;
              autoDisplay: boolean;
            },
            elementId: string
          ): void;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
  }
}

const GoogleTranslate = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const initTranslate = () => {
      const element = document.getElementById("google_translate_element");
      if (!element || element.hasChildNodes()) return;

      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "es",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
        initialized.current = true;
      }
    };

    // Set up the global callback
    window.googleTranslateElementInit = initTranslate;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="translate.google.com/translate_a/element.js"]');
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      // Script exists and Google is loaded
      initTranslate();
    }
  }, []);

  return <div id="google_translate_element" className="google-translate-container" />;
};

export default GoogleTranslate;
