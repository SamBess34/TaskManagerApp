import { FlatList } from 'react-native';
import { Task } from '../../TaskManagerApp/app/types';
import EmptyState from './EmptyState';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
}

export default function TaskList({ tasks, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggleComplete={onToggleComplete} />
      )}
      contentContainerStyle={{ padding: 16 }}
      className="flex-1"
      showsVerticalScrollIndicator={false}
    />
  );
}