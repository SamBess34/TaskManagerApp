import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import { ApiResponse, Task } from "../types";

const supabaseUrl = "VOTRE_URL_SUPABASE";
const supabaseKey = "VOTRE_CLE_SUPABASE";

const supabase = createClient(supabaseUrl, supabaseKey);

export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("createdAt", { ascending: false });

  return { data: data || [], error };
};

export const addTask = async (
  task: Omit<Task, "id">
): Promise<ApiResponse<Task>> => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([task])
    .select()
    .single();

  return { data: data as Task, error };
};

export const updateTask = async (
  id: string,
  updates: Partial<Task>
): Promise<ApiResponse<Task>> => {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { data: data as Task, error };
};

export const deleteTask = async (id: string): Promise<ApiResponse<null>> => {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  return { data: null, error };
};

export default supabase;
