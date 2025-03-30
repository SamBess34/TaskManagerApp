import { ReactNode } from "react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  due_date?: string | null;
}

export type TaskFilter = "all" | "today" | "week" | "overdue";

export interface ApiResponse<T> {
  data: T;
  error: Error | null;
}

export interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  addTask: (
    task: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface LanguageContextType {
  locale: string;
  changeLanguage: (newLocale: string) => Promise<void>;
  t: (key: string, params?: Record<string, any>) => string;
}

export interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export interface LanguageProviderProps {
  children: ReactNode;
}

export interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

export interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (
    title: string,
    description?: string,
    dueDate?: Date
  ) => Promise<void>;
}

export interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
}

export interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  groupByDay?: boolean;
}

export default {};
