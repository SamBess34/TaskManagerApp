import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fr";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TaskItemProps } from "../../app/types";
import { useLanguage } from "../../contexts/LanguageContext";

dayjs.extend(LocalizedFormat);

export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
}: TaskItemProps) {
  const { t, locale } = useLanguage();

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const getTimeRange = () => {
    if (!task.due_date) return null;

    try {
      const startTime = dayjs(task.due_date);
      // used format with language settings to display the time in the correct format
      const timeFormat = locale === "fr" ? "HH:mm" : "h:mm A";
      return startTime.format(timeFormat);
    } catch (error) {
      console.error("Error formatting time range:", error);
      return null;
    }
  };

  return (
    <View className="flex-row items-start mb-5 px-6">
      <TouchableOpacity
        className="mt-1 mr-4"
        onPress={onToggleComplete}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <View
          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            task.is_completed ? "bg-red-500 border-red-500" : "border-red-500"
          }`}
        >
          {task.is_completed && (
            <Ionicons name="checkmark" size={18} color="white" />
          )}
        </View>
      </TouchableOpacity>

      <View className="flex-1">
        <Text
          className={`text-lg font-medium ${
            task.is_completed ? "text-gray-400 line-through" : "text-gray-800"
          }`}
        >
          {task.title}
        </Text>

        {task.description && (
          <Text
            className={`text-base mt-1 ${
              task.is_completed ? "text-gray-400" : "text-gray-500"
            }`}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        {task.due_date && (
          <View className="flex-row mt-2 items-center">
            <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-md mr-2">
              <Ionicons name="calendar-outline" size={16} color="green" />
              <Text className="ml-1 text-sm text-gray-700">
                {getTimeRange()}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Text className="text-sm text-gray-500">
                {locale === "fr" ? "travail" : "work"}
              </Text>
            </View>

            <View className="flex-row items-center ml-auto">
              <Text className="text-sm text-gray-500">
                {locale === "fr" ? "Boîte" : "Inbox"}
              </Text>
              <Ionicons
                name="mail-outline"
                size={16}
                color="gray"
                className="ml-1"
              />
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={onDelete}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        className="ml-2 mt-1"
      >
        <Ionicons name="trash-outline" size={20} color="#dc4d3d" />
      </TouchableOpacity>
    </View>
  );
}
