// (root)/src/lib/i18n.ts
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import React, { createContext, useState, useMemo } from "react";

import en from "../../locales/en.json";
import es from "../../locales/es.json";

const availableLanguagesValues = { en, es };
const availableLanguages = {
  en: "English",
  es: "Español",
};

// Define the context with the proper types
export const TranslationContext = createContext<{
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  availableLanguages: Record<string, string>;
  translate: I18n["t"];
}>({
  language: "en",
  setLanguage: () => {},
  availableLanguages: {},
  translate: () => "",
});

type LanguageProviderProps = {
  children: React.ReactNode;
};

export const TranslationProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const deviceLanguage = getLocales()?.[0]?.languageCode ?? "en";
  const [language, setLanguage] = useState(deviceLanguage);

  const i18n = useMemo(() => {
    const instance = new I18n(availableLanguagesValues);
    instance.defaultLocale = deviceLanguage;
    instance.locale = language;
    return instance;
  }, [language, deviceLanguage]);

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage,
        availableLanguages,
        translate: i18n.t.bind(i18n),
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
