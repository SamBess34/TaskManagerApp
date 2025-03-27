import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import EmptyState from '../../components/ui/EmptyState';

export default function UpcomingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="auto" />
      
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Upcoming Tasks</Text>
      </View>
      
      <EmptyState message="The Upcoming tasks feature will be available soon!" />
    </SafeAreaView>
  );
}