import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const languages = [
  { code: "en", name: "English", short: "EN", flag: "🇺🇸" },
  { code: "es", name: "Español", short: "ES", flag: "🇪🇸" },
];

const GoogleTranslate = ({ variant = "dark" }: GoogleTranslateProps) => {
  const initialized = useRef(false);
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    // Check for existing googtrans cookie to set initial state
    const cookies = document.cookie.split(';');
    const googtrans = cookies.find(c => c.trim().startsWith('googtrans='));
    if (googtrans) {
      const value = googtrans.split('=')[1];
      if (value.includes('/es')) {
        setSelectedLang('es');
      }
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;

    const initTranslate = () => {
      const element = document.getElementById("google_translate_element_hidden");
      if (!element) return;

      element.innerHTML = "";

      if (window.google?.translate?.TranslateElement) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "es",
              layout: 0,
              autoDisplay: false,
            },
            "google_translate_element_hidden"
          );
          initialized.current = true;
        } catch (e) {
          // Already initialized
        }
      }
    };

    if (window.google?.translate) {
      initTranslate();
    } else {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (!existingScript) {
        window.googleTranslateElementInit = initTranslate;
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      } else {
        window.googleTranslateElementInit = initTranslate;
        setTimeout(initTranslate, 1000);
      }
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === selectedLang) return;
    
    setSelectedLang(langCode);
    
    if (langCode === 'en') {
      // Reset to English - need to restore original page
      // Method 1: Try using Google Translate's restore function
      const iframe = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
      if (iframe) {
        const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
        const restoreButton = innerDoc?.querySelector('.goog-te-button button') as HTMLButtonElement;
        if (restoreButton) {
          restoreButton.click();
          return;
        }
      }
      
      // Method 2: Try the combo box
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = '';
        selectElement.dispatchEvent(new Event('change'));
        return;
      }
      
      // Method 3: Clear cookies and reload
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = `googtrans=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      
      // Also try removing from the root domain
      const hostParts = window.location.hostname.split('.');
      if (hostParts.length > 2) {
        const rootDomain = hostParts.slice(-2).join('.');
        document.cookie = `googtrans=; path=/; domain=.${rootDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
      
      window.location.reload();
    } else {
      // Switch to another language
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
      } else {
        // Fallback: set cookie and reload
        document.cookie = `googtrans=/en/${langCode}; path=/`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
        window.location.reload();
      }
    }
  };

  const currentLang = languages.find(l => l.code === selectedLang) || languages[0];

  return (
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element_hidden" className="!hidden" style={{ display: 'none' }} />
      
      {/* Custom dropdown UI */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className={`
              flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors
              ${variant === "dark" 
                ? "text-muted-foreground hover:text-foreground hover:bg-secondary/50" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            <span className="text-base">{currentLang.flag}</span>
            <span>{currentLang.short}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[120px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`cursor-pointer ${selectedLang === lang.code ? "bg-accent" : ""}`}
            >
              <span className="text-base mr-2">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {selectedLang === lang.code && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default GoogleTranslate;
