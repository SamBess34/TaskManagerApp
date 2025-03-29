import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
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
import { Task } from "../../app/types";
import EmptyState from "../../components/ui/EmptyState";
import TaskForm from "../../components/ui/TaskForm";
import TaskList from "../../components/ui/TaskList";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  addTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../../services/taskService";

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

      if (!data) {
        setTasks([]);
        return;
      }

      const today = dayjs().endOf("day");
      const upcomingTasks = data.filter((task) => {
        if (!task.due_date) return false;

        const taskDate = dayjs(task.due_date);
        return taskDate.isAfter(today);
      });

      upcomingTasks.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return dayjs(a.due_date).isBefore(dayjs(b.due_date)) ? -1 : 1;
      });

      setTasks(upcomingTasks);
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
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          fetchUpcomingTasks();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [fetchUpcomingTasks]);

  const handleAddTask = async (
    title: string,
    description?: string,
    dueDate?: Date
  ) => {
    try {
      const taskDueDate = dueDate || dayjs().add(1, "day").toDate();

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

      fetchUpcomingTasks();
      setIsTaskFormVisible(false);
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err instanceof Error ? err.message : t("failedAddTask"));
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
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          groupByDay={true}
        />
      )}

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
