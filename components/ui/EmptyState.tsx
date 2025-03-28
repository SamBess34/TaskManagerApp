import React from "react";
import { Image, Text, View } from "react-native";

interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage }) => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="mb-8 items-center">
        <Image
          source={require("../../assets/images/soon.jpg")}
          className="w-64 h-64"
          resizeMode="contain"
        />
      </View>

      <Text className="text-xl font-bold text-gray-800 text-center mb-2">
        {message}
      </Text>

      {subMessage && (
        <Text className="text-base text-gray-600 text-center mb-8">
          {subMessage}
        </Text>
      )}
    </View>
  );
};

export default EmptyState;
