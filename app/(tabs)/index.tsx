import { Ionicons } from "@expo/vector-icons";
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

  const fetchTodayTasks = useCallback(async () => {
    try {
      console.log("Fetching today's tasks...");
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

        console.log(`Found ${todayTasks.length} tasks for today`);

        todayTasks.forEach((task) => {
          console.log(
            `Task in today: ${task.id}, ${task.title}, due: ${task.due_date}`
          );
        });
      }

      setTasks(todayTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("Home screen focused - refreshing tasks");
      fetchTodayTasks();
    }, [fetchTodayTasks])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          console.log("App has come to the foreground - refreshing tasks");
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
      console.log("Adding task:", { title, description, dueDate });

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

      console.log("Task added successfully:", data);

      fetchTodayTasks();

      setIsTaskFormVisible(false);
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err instanceof Error ? err.message : "Failed to add task");
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1">
        <View className="px-6 pt-4 pb-2">
          <Text className="text-4xl font-bold text-black">Today</Text>
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
              <Text className="text-white">Réessayer</Text>
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

      <TouchableOpacity
        className="absolute top-4 right-6 p-2 rounded-full bg-gray-100"
        onPress={fetchTodayTasks}
      >
        <Ionicons name="refresh" size={20} color="#dc4d3d" />
      </TouchableOpacity>

      <TaskForm
        visible={isTaskFormVisible}
        onClose={() => setIsTaskFormVisible(false)}
        onAddTask={handleAddTask}
      />

      <TouchableOpacity
        className="absolute bottom-20 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: "#dc4d3d" }}
        onPress={() => setIsTaskFormVisible(true)}
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
