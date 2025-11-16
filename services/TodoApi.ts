import { GetTodosParams, PaginatedTodos, Todo } from "@/types/type";
import api from "./api";
import axios from "axios";


const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createTodo(todoData: {
  title: string;
  description: string;
  priority: string;
  todo_date: string;
}) {
  const token = localStorage.getItem("access_token");

  const res = await axios.post(
    `${API}/api/todos/`,
    todoData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data as Todo;
}



export async function getTodos(params: GetTodosParams = {}): Promise<PaginatedTodos> {
  const response = await api.get<PaginatedTodos>("/api/todos/", {
    params,
  });
  return response.data;
}


const token = typeof window !== "undefined"
  ? localStorage.getItem("access_token")
  : null;

// export async function createTodo(payload: any) {
//   const res = await api.post("/api/todos/", payload, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return res.data;
// }


export async function updateTodo(id: number, payload: any) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await api.patch(`/api/todos/${id}/`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
}

export async function deleteTodo(id: number) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await api.delete(`/api/todos/${id}/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
}