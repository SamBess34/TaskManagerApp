import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import TaskForm from '../../components/ui/TaskForm';
import TaskList from '../../components/ui/TaskList';
import { addTask, getTasks, updateTask } from '../services/supabase';
import { Task } from '../types';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await getTasks();
      
      if (error) {
        throw new Error(error.message);
      }
      
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      const newTask = {
        title,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      
      const { data, error } = await addTask(newTask);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setTasks([data, ...tasks]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const { error } = await updateTask(id, { isCompleted: !task.isCompleted });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setTasks(
        tasks.map(t => 
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="auto" />
      
      <View className="flex-1">
        <View className="p-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">Today's Tasks</Text>
        </View>
        
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : (
          <TaskList 
            tasks={tasks} 
            onToggleComplete={handleToggleComplete} 
          />
        )}
      </View>
      
      <TaskForm onAddTask={handleAddTask} />
    </SafeAreaView>
  );
}