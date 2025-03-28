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
import { signUp } from "../../services/authService";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un email");
      return;
    }

    if (!password) {
      Alert.alert("Erreur", "Veuillez entrer un mot de passe");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      await signUp(email.trim(), password);

      Alert.alert(
        "Compte créé",
        "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      Alert.alert(
        "Échec de l'inscription",
        error.message || "Une erreur s'est produite lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-2xl font-bold mb-8 text-center">
        Créer un compte
      </Text>

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
        className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50"
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="p-4 border border-gray-300 rounded-lg mb-6 bg-gray-50"
        placeholder="Confirmer le mot de passe"
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
          <Text className="text-white font-semibold text-base">S'inscrire</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 items-center"
        onPress={() => router.push("/login")}
      >
        <Text className="text-blue-500">Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}
