import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "../../services/authService";

export default function TabsLayout() {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const currentDay = dayjs().date();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
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
        <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
      </TouchableOpacity>

      {showMenu && (
        <View className="absolute top-10 right-4 bg-white rounded-lg p-2 shadow-md z-50">
          <TouchableOpacity
            className="flex-row items-center p-2"
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#dc4d3d"
              className="mr-2"
            />
            <Text className="text-red-600">Déconnexion</Text>
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
            title: "Today",
            tabBarIcon: ({ color, focused }) => (
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
                Today
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="upcoming"
          options={{
            title: "Upcoming",
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
                Upcoming
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
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
                Search
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="browse"
          options={{
            title: "Browse",
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
                Browse
              </Text>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
