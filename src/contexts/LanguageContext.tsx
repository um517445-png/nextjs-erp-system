'use client';
import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import arTranslations from '@/locales/ar.json';
import enTranslations from '@/locales/en.json';

export type Locale = 'ar' | 'en';

interface LanguageContextType {
  language: Locale;
  setLanguage: (language: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Locale, any> = {
  ar: arTranslations,
  en: enTranslations,
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Locale>('ar'); // Default to Arabic unconditionally

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('erpLanguage');
      if (storedLang === 'en') {
        setLanguageState('en');
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
      } else {
        // Auto-purge any stale 'es' or unknown language key, forcing Arabic
        localStorage.setItem('erpLanguage', 'ar');
        setLanguageState('ar');
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
      }
    } catch {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    }
  }, []);

  const setLanguage = useCallback((lang: Locale) => {
    const validLang = lang === 'en' ? 'en' : 'ar';
    try {
      localStorage.setItem('erpLanguage', validLang);
    } catch {}
    setLanguageState(validLang);
    document.documentElement.lang = validLang;
    document.documentElement.dir = validLang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result = translations[language] || translations['ar'];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to Arabic if translation not found in current language
        let fallbackResult = translations['ar'];
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk];
          if (fallbackResult === undefined) {
            return key;
          }
        }
        result = fallbackResult;
        break;
      }
    }
    
    if (typeof result === 'string' && params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      }, result);
    }
    
    return typeof result === 'string' ? result : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
