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
import { signIn } from "../../services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  console.log("login screen");
  async function handleLogin() {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre email");
      return;
    }

    if (!password) {
      Alert.alert("Erreur", "Veuillez entrer votre mot de passe");
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace("/");
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      Alert.alert(
        "Échec de connexion",
        error.message || "Une erreur s'est produite lors de la connexion"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-2xl font-bold mb-8 text-center">Connexion</Text>

      <TextInput
        className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <TextInput
        className="p-4 border border-gray-300 rounded-lg mb-6 bg-gray-50"
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className={`p-4 rounded-lg items-center ${
          loading ? "bg-blue-400" : "bg-blue-500"
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">
            Se connecter
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 items-center"
        onPress={() => router.push("/signup")}
      >
        <Text className="text-blue-500">Pas encore de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}
