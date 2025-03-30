import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import LanguageSelector from "../../components/ui/LanguageSelector";
import "../../global.css";

export default function AuthLayout() {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  return (
    <View className="flex-1">
      <TouchableOpacity
        className="absolute top-10 right-4 z-50 p-2.5"
        onPress={() => {
          setShowLanguageSelector(true);
        }}
      >
        <Ionicons name="globe-outline" size={24} color="#dc4d3d" />
      </TouchableOpacity>

      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: "",
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>

      {showLanguageSelector && (
        <LanguageSelector
          visible={true}
          onClose={() => setShowLanguageSelector(false)}
        />
      )}
    </View>
  );
}
