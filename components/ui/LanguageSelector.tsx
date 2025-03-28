// src/components/ui/LanguageSelector.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { LanguageContextType, LanguageSelectorProps } from "../../app/types";
import { useLanguage } from "../../contexts/LanguageContext";

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
}) => {
  const { locale, changeLanguage, t } = useLanguage() as LanguageContextType;

  const handleSelectLanguage = async (newLocale: string) => {
    await changeLanguage(newLocale);
    onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-4/5 bg-white rounded-lg p-5 shadow-lg">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-lg font-bold">{t("changeLanguage")}</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`flex-row justify-between items-center py-4 px-3 rounded-lg mb-2.5 ${
              locale === "en" ? "bg-gray-100" : ""
            }`}
            onPress={() => handleSelectLanguage("en")}
          >
            <Text className="text-base">{t("english")}</Text>
            {locale === "en" && (
              <Ionicons name="checkmark" size={20} color="#dc4d3d" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row justify-between items-center py-4 px-3 rounded-lg mb-2.5 ${
              locale === "fr" ? "bg-gray-100" : ""
            }`}
            onPress={() => handleSelectLanguage("fr")}
          >
            <Text className="text-base">{t("french")}</Text>
            {locale === "fr" && (
              <Ionicons name="checkmark" size={20} color="#dc4d3d" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageSelector;
