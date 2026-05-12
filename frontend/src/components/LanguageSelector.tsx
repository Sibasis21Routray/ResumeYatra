import React from "react";
import { Language } from "../translations";

interface LanguageSelectorProps {
  language: Language | "custom";
  customLanguage: string;
  onLanguageChange: (language: Language | "custom") => void;
  onCustomLanguageChange: (language: string) => void;
  isTranslating?: boolean;
}

export function LanguageSelector({
  language,
  customLanguage,
  onLanguageChange,
  onCustomLanguageChange,
  isTranslating = false,
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <select
        value={language}
        onChange={(e) =>
          onLanguageChange(e.target.value as Language | "custom")
        }
        className="bg-black text-white border border-white/20 rounded px-3 py-1 text-sm"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="hi">हिन्दी</option>
        <option value="bn">বাংলা</option>
      </select>
      {language === "custom" && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={customLanguage}
            onChange={(e) => onCustomLanguageChange(e.target.value)}
            placeholder="Enter language name"
            className="bg-black text-white border border-white/20 rounded px-3 py-1 text-sm min-w-[120px]"
            disabled={isTranslating}
          />
          {isTranslating && (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          )}
        </div>
      )}
    </div>
  );
}
