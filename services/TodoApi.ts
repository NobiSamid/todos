import { PaginatedTodos } from "@/types/type";
import api from "./api";


type GetTodosParams = {
  search?: string;
  priority?: string;
  is_completed?: boolean | string;
  todo_date?: string;
  page?: number;
};

export async function getTodos(params: GetTodosParams = {}): Promise<PaginatedTodos> {
  const response = await api.get<PaginatedTodos>("/api/todos/", {
    params,
  });
  return response.data;
}