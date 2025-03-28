import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "./translations";

const i18n = new I18n(translations);

// define default locale with the device locale
i18n.locale = Localization.locale.split("-")[0];

// Fallback if translation is missing
i18n.enableFallback = true;
i18n.defaultLocale = "en";

export const changeLanguage = async (locale: string) => {
  try {
    i18n.locale = locale;
    await AsyncStorage.setItem("userLanguage", locale);
  } catch (error) {
    console.error("Failed to save language preference.", error);
  }
};

export const initLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("userLanguage");
    if (savedLanguage) {
      i18n.locale = savedLanguage;
    }
  } catch (error) {
    console.error("Failed to load language preference.", error);
  }
};

export default i18n;
