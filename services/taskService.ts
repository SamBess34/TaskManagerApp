import { Task } from "../app/types";
import { getCurrentUser } from "./authService";
import { supabase } from "./supabaseClient";

export async function getTasks() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      console.log("No authenticated user - returning empty task list");
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true });

    return { data, error };
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return { data: [], error };
  }
}

export async function getTasksByDueDate(
  filter: "today" | "week" | "all" = "all"
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      console.log("No authenticated user - returning empty task list");
      return { data: [], error: null };
    }

    let query = supabase.from("tasks").select("*").eq("user_id", user.id);

    if (filter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      query = query
        .gte("due_date", today.toISOString())
        .lt("due_date", tomorrow.toISOString());
    } else if (filter === "week") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      query = query
        .gte("due_date", today.toISOString())
        .lt("due_date", nextWeek.toISOString());
    }

    const { data, error } = await query.order("due_date", { ascending: true });

    return { data, error };
  } catch (error: any) {
    console.error("Error fetching tasks by due date:", error);
    return { data: [], error };
  }
}

export async function addTask(
  task: Omit<Task, "id" | "created_at" | "updated_at">
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, error: new Error("Utilisateur non authentifié") };
    }

    const taskWithFormattedDate = {
      ...task,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert([taskWithFormattedDate])
      .select()
      .single();

    return { data, error };
  } catch (error: any) {
    console.error("Error adding task:", error);
    return { data: null, error };
  }
}

export async function updateTask(id: string, updates: Partial<Task>) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  } catch (error: any) {
    console.error("Error updating task:", error);
    return { data: null, error };
  }
}

export async function deleteTask(id: string) {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    return { error };
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return { error };
  }
}
