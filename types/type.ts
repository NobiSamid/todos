export type SignupPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
};

export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  address?: string;
  contact_number?: string;
  birthday?: string; // YYYY-MM-DD
  bio?: string;
  profile_image?: File | null;
};


export type Todo = {
  id: number;
  title: string;
  description?: string;
  priority?: "extreme" | "moderate" | "low" | string;
  is_completed: boolean;
  position?: number;
  todo_date?: string; // ISO date string
  created_at?: string;
  updated_at?: string;
};

export type PaginatedTodos = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Todo[];
};

export type GetTodosParams = {
  search?: string;
  priority?: string;
  is_completed?: boolean | string;
  todo_date?: string;
  page?: number;
};
