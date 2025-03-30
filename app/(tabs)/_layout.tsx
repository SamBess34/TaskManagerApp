import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LanguageSelector from "../../components/ui/LanguageSelector";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { signOut } from "../../services/authService";

export default function TabsLayout() {
  const { user } = useAuth();
  const { t, locale } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  dayjs.locale(locale);
  const currentDay = dayjs().date();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      setShowMenu(false);
    }
  };

  const renderHeaderRight = () => (
    <View className="relative">
      <TouchableOpacity
        className="px-4 py-2"
        onPress={() => setShowMenu(!showMenu)}
      >
        <Ionicons
          name="ellipsis-horizontal-outline"
          size={30}
          color="#dc4d3d"
        />
      </TouchableOpacity>

      {showMenu && (
        <View
          className="absolute top-10 right-4 bg-white rounded-lg p-2 z-50 elevation-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <TouchableOpacity
            className="flex-row items-center justify-center p-2"
            onPress={() => {
              setShowLanguageSelector(true);
              setShowMenu(false);
            }}
          >
            <Ionicons name="globe-outline" size={24} color="#dc4d3d" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center p-2 mt-1"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#dc4d3d" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <>
      <StatusBar style="dark" />

      <Tabs
        screenOptions={{
          headerShown: true,
          headerRight: renderHeaderRight,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: "white",
          },
          headerTintColor: "#000",
          tabBarStyle: {
            backgroundColor: "#fcfaf8",
            height: 80,
          },
          tabBarActiveTintColor: "#E34C3B",
          tabBarInactiveTintColor: "#dc4d3d",
          headerTitle: "",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("todayTab"),
            tabBarIcon: ({ focused }) => (
              <View className="items-center justify-center">
                <View
                  className={`items-center justify-center rounded-full w-6 h-6 ${
                    focused ? "bg-red-500" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      focused ? "text-white" : "text-red-500"
                    }`}
                  >
                    {currentDay}
                  </Text>
                </View>
              </View>
            ),
            tabBarLabel: ({ color }) => (
              <Text className="text-xs mt-1 font-bold" style={{ color }}>
                {t("todayTab")}
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="upcoming"
          options={{
            title: t("upcoming"),
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center justify-center pt-1">
                <Ionicons
                  name={focused ? "calendar" : "calendar-outline"}
                  size={22}
                  color={color}
                />
              </View>
            ),
            tabBarLabel: ({ color }) => (
              <Text className="text-xs mt-1" style={{ color }}>
                {t("upcoming")}
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: t("search"),
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center justify-center pt-1">
                <Ionicons
                  name={focused ? "search" : "search-outline"}
                  size={22}
                  color={color}
                />
              </View>
            ),
            tabBarLabel: ({ color }) => (
              <Text className="text-xs mt-1" style={{ color }}>
                {t("search")}
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="browse"
          options={{
            title: t("browse"),
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center justify-center pt-1">
                <Ionicons
                  name={focused ? "menu" : "menu-outline"}
                  size={22}
                  color={color}
                />
              </View>
            ),
            tabBarLabel: ({ color }) => (
              <Text className="text-xs mt-1" style={{ color }}>
                {t("browse")}
              </Text>
            ),
          }}
        />
      </Tabs>

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </>
  );
}
