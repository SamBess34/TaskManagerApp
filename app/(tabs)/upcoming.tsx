import { Ionicons } from "@expo/vector-icons";
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
import TaskList from "../../components/ui/TaskList";
import { deleteTask, getTasks, updateTask } from "../../services/taskService";

dayjs.extend(isBetween);

export default function UpcomingScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingTasks = useCallback(async () => {
    try {
      console.log("Fetching upcoming tasks...");
      setLoading(true);

      const { data, error } = await getTasks();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        setTasks([]);
        return;
      }

      console.log(`Total tasks fetched: ${data.length}`);

      const today = dayjs().endOf("day");
      const upcomingTasks = data.filter((task) => {
        if (!task.due_date) return false;

        const taskDate = dayjs(task.due_date);
        return taskDate.isAfter(today);
      });

      console.log(`Upcoming tasks after filtering: ${upcomingTasks.length}`);

      upcomingTasks.forEach((task) => {
        console.log(
          `Task: ${task.id}, ${task.title}, Date: ${
            task.due_date
          }, Formaté: ${dayjs(task.due_date).format("YYYY-MM-DD HH:mm")}`
        );
      });

      upcomingTasks.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return dayjs(a.due_date).isBefore(dayjs(b.due_date)) ? -1 : 1;
      });

      setTasks(upcomingTasks);
    } catch (err) {
      console.error("Error in fetchUpcomingTasks:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch upcoming tasks"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcomingTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("Upcoming screen focused - refreshing tasks");
      fetchUpcomingTasks();
    }, [fetchUpcomingTasks])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          console.log(
            "App has come to the foreground - refreshing upcoming tasks"
          );
          fetchUpcomingTasks();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [fetchUpcomingTasks]);

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
      setError(err instanceof Error ? err.message : "Failed to update task");
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
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-6 py-4">
        <Text className="text-4xl font-bold text-black">À venir</Text>
      </View>

      <TouchableOpacity
        className="absolute top-4 right-6 p-2 rounded-full bg-gray-100"
        onPress={fetchUpcomingTasks}
      >
        <Ionicons name="refresh" size={20} color="#dc4d3d" />
      </TouchableOpacity>

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
            <Text className="text-white">Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : tasks.length === 0 ? (
        <EmptyState
          message="Aucune tâche à venir!"
          subMessage="Toutes vos tâches futures apparaîtront ici."
        />
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          groupByDay={true}
        />
      )}
    </SafeAreaView>
  );
}
