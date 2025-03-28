import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import i18n, { changeLanguage, initLanguage } from "../i18n";

interface LanguageContextType {
  locale: string;
  changeLanguage: (newLocale: string) => Promise<void>;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  changeLanguage: async () => {},
  t: (key) => key,
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [locale, setLocale] = useState<string>(i18n.locale || "en");

  const translate = useCallback(
    (key: string, params?: Record<string, any>) => {
      return i18n.t(key, params || {});
    },
    [locale]
  );

  useEffect(() => {
    const initialize = async () => {
      await initLanguage();
      setLocale(i18n.locale);
    };

    initialize();
  }, []);

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
