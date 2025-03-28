import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import EmptyState from "../../components/ui/EmptyState";
import { useLanguage } from "../../contexts/LanguageContext";

export default function SearchScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-6 py-4">
        <Text className="text-4xl font-bold text-black">{t("search")}</Text>
      </View>

      <EmptyState
        message={t("featureComingSoon")}
        subMessage={t("searchDescription")}
      />
    </SafeAreaView>
  );
}
