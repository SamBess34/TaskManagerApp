import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../../app/types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
}

export default function TaskItem({ task, onToggleComplete }: TaskItemProps) {
  return (
    <View className="flex-row items-center p-4 bg-white rounded-lg mb-2 shadow-sm">
      <TouchableOpacity 
        onPress={() => onToggleComplete(task.id)}
        className="mr-3"
      >
        <View className={`w-6 h-6 rounded-full border-2 ${task.isCompleted ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
          {task.isCompleted && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      </TouchableOpacity>
      
      <Text className={`flex-1 text-base ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
        {task.title}
      </Text>
      
      {task.dueDate && (
        <Text className="text-xs text-gray-500">
          {new Date(task.dueDate).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
}