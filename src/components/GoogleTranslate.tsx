import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
];

const GoogleTranslate = ({ variant = "dark" }: GoogleTranslateProps) => {
  const initialized = useRef(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

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
              includedLanguages: "es,fr,de,it,pt,zh-CN,ja,ko",
              layout: 0,
              autoDisplay: false,
            },
            "google_translate_element_hidden"
          );
          initialized.current = true;
          setIsGoogleLoaded(true);
        } catch (e) {
          console.log("Google Translate init error");
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
    setSelectedLang(langCode);
    
    // Try to trigger Google Translate
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    } else {
      // Fallback: set cookie for Google Translate
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      window.location.reload();
    }
  };

  const currentLang = languages.find(l => l.code === selectedLang) || languages[0];

  return (
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element_hidden" className="hidden" />
      
      {/* Custom dropdown UI */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={variant === "dark" 
              ? "text-muted-foreground hover:text-foreground gap-2" 
              : "text-gray-600 hover:text-gray-900 gap-2"
            }
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">{currentLang.flag} {currentLang.name}</span>
            <span className="sm:hidden">{currentLang.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={selectedLang === lang.code ? "bg-accent" : ""}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default GoogleTranslate;
