import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
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
  addTask,
  deleteTask,
  getTasksByDueDate,
  updateTask,
} from "../../services/taskService";
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

      const today = dayjs().startOf("day");
      const tomorrow = dayjs().add(1, "day").startOf("day");

      let todayTasks = [];

      if (data) {
        todayTasks = data.filter((task) => {
          if (!task.due_date) return false;

          const taskDate = dayjs(task.due_date);
          return taskDate.isBetween(today, tomorrow, null, "[)");
        });
      }

      setTasks(todayTasks);
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
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          fetchTodayTasks();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [fetchTodayTasks]);

  const handleAddTask = async (
    title: string,
    description?: string,
    dueDate?: Date
  ) => {
    try {
      const taskDueDate = dueDate || new Date();

      const newTask = {
        title,
        description,
        is_completed: false,
        user_id: user?.id || "",
        due_date: taskDueDate.toISOString(),
      };

      const { data, error } = await addTask(newTask);

      if (error) {
        throw new Error(error.message);
      }

      fetchTodayTasks();

      setIsTaskFormVisible(false);
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err instanceof Error ? err.message : t("failedAddTask"));
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await deleteTask(id);

      if (error) {
        throw new Error(error.message);
      }

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedDeleteTask"));
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const { error } = await updateTask(id, {
        is_completed: !task.is_completed,
      });

      if (error) {
        throw new Error(error.message);
      }

      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, is_completed: !t.is_completed } : t
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedUpdateTask"));
    }
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
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </View>

      <TaskForm
        visible={isTaskFormVisible}
        onClose={() => setIsTaskFormVisible(false)}
        onAddTask={handleAddTask}
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
