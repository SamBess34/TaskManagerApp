export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  dueDate?: string;
}

export interface ApiResponse<T> {
  data: T;
  error: Error | null;
}

export default {};
