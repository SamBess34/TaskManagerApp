import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // if the user is connect
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  // else redirect to login page
  return <Redirect href="/(auth)/login" />;
}
