import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";
import { signIn } from "../../services/authService";

export default function LoginScreen() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email.trim()) {
      Alert.alert("Error", t("enterEmail"));
      return;
    }

    if (!password) {
      Alert.alert("Error", t("enterPassword"));
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace("/");
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      Alert.alert(
        t("loginError"),
        error.message || t("defaultLoginErrorMessage")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-white"
      >
        <View className="flex-1 justify-start p-8 pt-16 bg-white">
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-red-500 rounded-xl items-center justify-center mb-3">
              <Ionicons name="checkmark-done" size={32} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              TaskManagerApp
            </Text>
          </View>

          <Text className="text-3xl font-bold mb-6 text-gray-800">
            {t("login")}
          </Text>

          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t("email")}
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4">
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 p-4 text-gray-800"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholderTextColor="#9CA3AF"
                placeholder={t("email")}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t("password")}
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 p-4 text-gray-800"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
                placeholder={t("password")}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className={`p-4 rounded-xl items-center ${
              loading ? "bg-red-400" : "bg-red-500"
            }`}
            onPress={handleLogin}
            disabled={loading}
            style={{
              shadowColor: "#dc4d3d",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t("loginButton")}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-8 items-center"
            onPress={() => router.push("/signup")}
          >
            <Text className="text-red-500">{t("noAccount")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
