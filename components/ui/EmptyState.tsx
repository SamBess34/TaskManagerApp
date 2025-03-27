import React from 'react';
import { Image, Text, View } from 'react-native';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "No tasks yet! Add your first task to get started." }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Image 
        source={require('../../assets/images/empty-state.jpg')}
        className="w-40 h-40 mb-4"
        resizeMode="contain"
      />
      <Text className="text-gray-500 text-center text-lg">{message}</Text>
    </View>
  );
}