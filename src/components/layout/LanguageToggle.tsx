"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border-border bg-card text-foreground hover:bg-muted hover:text-amber-500 transition-all shadow-xs"
      title={language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
    >
      <Languages className="h-3.5 w-3.5 text-amber-500" />
      <span>{language === 'ar' ? 'English' : 'عربي'}</span>
    </Button>
  );
}
