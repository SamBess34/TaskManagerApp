// src/app/home/index.tsx
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TaskForm from "../../components/ui/TaskForm";
import TaskList from "../../components/ui/TaskList";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  createAppStateListener,
  filterTodayTasks,
  handleAddTask,
  handleDeleteTask,
  handleToggleComplete,
} from "../../functions/utils/TaskUtils";
import { getTasksByDueDate } from "../../services/taskService";
import { Task } from "../types";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  const fetchTodayTasks = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await getTasksByDueDate("today");

      if (error) {
        throw new Error(error.message);
      }

      setTasks(data ? filterTodayTasks(data) : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err instanceof Error ? err.message : t("failedFetchTasks"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTodayTasks();
  }, [fetchTodayTasks]);

  useFocusEffect(
    useCallback(() => {
      fetchTodayTasks();
    }, [fetchTodayTasks])
  );

  useEffect(() => {
    const subscription = createAppStateListener(fetchTodayTasks);
    return () => {
      subscription.remove();
    };
  }, [fetchTodayTasks]);

  const addTaskHandler = (
    title: string,
    description?: string,
    dueDate?: Date
  ) => {
    return handleAddTask(
      title,
      description,
      dueDate,
      user?.id || "",
      new Date(),
      fetchTodayTasks,
      (message) => setError(message),
      t,
      () => setIsTaskFormVisible(false)
    );
  };

  const toggleCompleteHandler = (id: string) => {
    return handleToggleComplete(
      id,
      tasks,
      setTasks,
      (message) => setError(message),
      t
    );
  };

  const deleteTaskHandler = (id: string) => {
    return handleDeleteTask(
      id,
      tasks,
      setTasks,
      (message) => setError(message),
      t
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1">
        <View className="px-6 pt-4 pb-2">
          <Text className="text-4xl font-bold text-black">{t("todayTab")}</Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#dc4d3d" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-red-500 text-center">{error}</Text>
            <TouchableOpacity
              className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
              onPress={fetchTodayTasks}
            >
              <Text className="text-white">{t("retry")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleCompleteHandler}
            onDeleteTask={deleteTaskHandler}
          />
        )}
      </View>

      <TaskForm
        visible={isTaskFormVisible}
        onClose={() => setIsTaskFormVisible(false)}
        onAddTask={addTaskHandler}
      />

      <TouchableOpacity
        className="absolute bottom-20 right-6 bottom-7 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: "#dc4d3d" }}
        onPress={() => setIsTaskFormVisible(true)}
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
