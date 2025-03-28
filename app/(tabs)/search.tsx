import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import EmptyState from "../../components/ui/EmptyState";

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-6 py-4">
        <Text className="text-4xl font-bold text-black">Search</Text>
      </View>

      <EmptyState
        message="The Search feature will be available soon!"
        subMessage="We're working hard to bring you the best search experience."
      />
    </SafeAreaView>
  );
}
