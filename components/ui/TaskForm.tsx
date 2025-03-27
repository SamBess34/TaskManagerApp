import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface TaskFormProps {
  onAddTask: (title: string) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask(title.trim());
      setTitle('');
    }
  };

  return (
    <View className="p-4 border-t border-gray-200 bg-white flex-row">
      <TextInput
        className="flex-1 bg-gray-100 rounded-lg px-4 py-2 mr-2"
        placeholder="Add a new task..."
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-500 rounded-lg items-center justify-center w-10 h-10"
        disabled={!title.trim()}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}