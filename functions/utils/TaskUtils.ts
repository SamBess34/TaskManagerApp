import dayjs from "dayjs";
import { AppState, AppStateStatus } from "react-native";
import { Task } from "../../app/types";
import {
  addTask as addTaskService,
  deleteTask as deleteTaskService,
  updateTask as updateTaskService,
} from "../../services/taskService";

// handle adding a new task
export const handleAddTask = async (
  title: string,
  description: string | undefined,
  dueDate: Date | undefined,
  userId: string,
  defaultDueDate: Date,
  onSuccess: () => void,
  onError: (message: string) => void,
  t: (key: string) => string,
  closeForm: () => void
) => {
  try {
    const taskDueDate = dueDate || defaultDueDate;

    const newTask = {
      title,
      description,
      is_completed: false,
      user_id: userId,
      due_date: taskDueDate.toISOString(),
    };

    const { data, error } = await addTaskService(newTask);

    if (error) {
      throw new Error(error.message);
    }

    onSuccess();
    closeForm();
  } catch (err) {
    console.error("Error adding task:", err);
    onError(err instanceof Error ? err.message : t("failedAddTask"));
  }
};

// handle toggling task completion status
export const handleToggleComplete = async (
  id: string,
  tasks: Task[],
  updateTasks: (tasks: Task[]) => void,
  onError: (message: string) => void,
  t: (key: string) => string
) => {
  try {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const { error } = await updateTaskService(id, {
      is_completed: !task.is_completed,
    });

    if (error) {
      throw new Error(error.message);
    }

    updateTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, is_completed: !t.is_completed } : t
      )
    );
  } catch (err) {
    onError(err instanceof Error ? err.message : t("failedUpdateTask"));
  }
};

// handle deleting a task
export const handleDeleteTask = async (
  id: string,
  tasks: Task[],
  updateTasks: (tasks: Task[]) => void,
  onError: (message: string) => void,
  t: (key: string) => string
) => {
  try {
    const { error } = await deleteTaskService(id);

    if (error) {
      throw new Error(error.message);
    }

    updateTasks(tasks.filter((task) => task.id !== id));
  } catch (err) {
    onError(err instanceof Error ? err.message : t("failedDeleteTask"));
  }
};

// create an app state change listener for refreshing data
export const createAppStateListener = (onActive: () => void) => {
  const subscription = AppState.addEventListener(
    "change",
    (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        onActive();
      }
    }
  );

  return subscription;
};

// filter tasks for today
export const filterTodayTasks = (tasks: Task[]) => {
  const today = dayjs().startOf("day");
  const tomorrow = dayjs().add(1, "day").startOf("day");

  return tasks.filter((task) => {
    if (!task.due_date) return false;

    const taskDate = dayjs(task.due_date);
    return taskDate.isBetween(today, tomorrow, null, "[)");
  });
};

// filter tasks for upcoming days (after today)
export const filterUpcomingTasks = (tasks: Task[]) => {
  const today = dayjs().endOf("day");

  const upcomingTasks = tasks.filter((task) => {
    if (!task.due_date) return false;

    const taskDate = dayjs(task.due_date);
    return taskDate.isAfter(today);
  });

  // Sort tasks by due date
  return upcomingTasks.sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return dayjs(a.due_date).isBefore(dayjs(b.due_date)) ? -1 : 1;
  });
};
