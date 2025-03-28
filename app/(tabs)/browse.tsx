import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import EmptyState from "../../components/ui/EmptyState";

export default function BrowseScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-6 py-4">
        <Text className="text-4xl font-bold text-black">Browse</Text>
      </View>

      <EmptyState
        message="The Browse feature will be available soon!"
        subMessage="Browse and organize your tasks by categories and projects."
      />
    </SafeAreaView>
  );
}
