import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";
import { signUp } from "../../services/authService";

export default function SignupScreen() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email.trim()) {
      Alert.alert("Error", t("enterEmail"));
      return;
    }

    if (!password) {
      Alert.alert("Error", t("enterPassword"));
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", t("passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", t("passwordsNotMatch"));
      return;
    }

    try {
      setLoading(true);
      await signUp(email.trim(), password);

      Alert.alert(t("accountCreated"), t("accountCreatedMessage"), [
        { text: t("ok"), onPress: () => router.replace("/login") },
      ]);
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      Alert.alert(
        t("signupError"),
        error.message || t("defaultSignupErrorMessage")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-2xl font-bold mb-8 text-center">{t("signup")}</Text>

      <TextInput
        className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50"
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <TextInput
        className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50"
        placeholder={t("password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="p-4 border border-gray-300 rounded-lg mb-6 bg-gray-50"
        placeholder={t("confirmPassword")}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className={`p-4 rounded-lg items-center ${
          loading ? "bg-blue-400" : "bg-blue-500"
        }`}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">
            {t("signupButton")}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 items-center"
        onPress={() => router.push("/login")}
      >
        <Text className="text-blue-500">{t("alreadyAccount")}</Text>
      </TouchableOpacity>
    </View>
  );
}
