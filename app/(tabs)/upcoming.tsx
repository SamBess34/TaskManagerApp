import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Task } from "../../app/types";
import EmptyState from "../../components/ui/EmptyState";
import TaskForm from "../../components/ui/TaskForm";
import TaskList from "../../components/ui/TaskList";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  createAppStateListener,
  filterUpcomingTasks,
  handleAddTask,
  handleDeleteTask,
  handleToggleComplete,
} from "../../functions/utils/TaskUtils";
import { getTasks } from "../../services/taskService";

dayjs.extend(isBetween);

export default function UpcomingScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const { user } = useAuth();
  const { t, locale } = useLanguage();

  const fetchUpcomingTasks = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await getTasks();

      if (error) {
        throw new Error(error.message);
      }

      setTasks(data ? filterUpcomingTasks(data) : []);
    } catch (err) {
      console.error("Error in fetchUpcomingTasks:", err);
      setError(err instanceof Error ? err.message : t("failedFetchTasks"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  useEffect(() => {
    fetchUpcomingTasks();
  }, [fetchUpcomingTasks]);

  useFocusEffect(
    useCallback(() => {
      fetchUpcomingTasks();
    }, [fetchUpcomingTasks])
  );

  useEffect(() => {
    const subscription = createAppStateListener(fetchUpcomingTasks);
    return () => {
      subscription.remove();
    };
  }, [fetchUpcomingTasks]);

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
      dayjs().add(1, "day").toDate(),
      fetchUpcomingTasks,
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

      <View className="px-6 py-4">
        <Text className="text-4xl font-bold text-black">{t("upcoming")}</Text>
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
            onPress={fetchUpcomingTasks}
          >
            <Text className="text-white">{t("retry")}</Text>
          </TouchableOpacity>
        </View>
      ) : tasks.length === 0 ? (
        <EmptyState
          message={t("noUpcomingTasks")}
          subMessage={t("upcomingTasksWillAppearHere")}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleCompleteHandler}
          onDeleteTask={deleteTaskHandler}
          groupByDay={true}
        />
      )}

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
