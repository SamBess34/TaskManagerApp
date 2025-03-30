import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LanguageContextType, LanguageProviderProps } from "../app/types";
import i18n, { changeLanguage, initLanguage } from "../i18n";

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  changeLanguage: async () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [locale, setLocale] = useState<string>(i18n.locale || "en");

  // translation function that uses i18n to translate
  const translate = useCallback(
    (key: string, params?: Record<string, any>) => {
      return i18n.t(key, params || {});
    },
    [locale]
  );

  // initialize the language settings
  useEffect(() => {
    const initialize = async () => {
      await initLanguage();

      // force en by default
      if (i18n.locale !== "en") {
        await changeLanguage("en");
      }

      setLocale(i18n.locale);
    };

    initialize();
  }, []);

  // handle language change and update the context
  const handleChangeLanguage = useCallback(
    async (newLocale: string): Promise<void> => {
      try {
        await changeLanguage(newLocale);
        setLocale(newLocale);
      } catch (error) {
        console.error("Failed to change language:", error);
      }
    },
    []
  );

  const contextValue = {
    locale,
    changeLanguage: handleChangeLanguage,
    t: translate,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
