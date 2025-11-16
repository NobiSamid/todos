"use client";

import NoTodo from '@/components/NoTodo';
import { getTodos } from '@/services/TodoApi';
import React, { useEffect, useState } from 'react'
import TodoCard from './TodoCard';
import { Todo } from '@/types/type';


const TodoList = ({ initialFilterCompleted = true }: { initialFilterCompleted?: boolean }) => {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

  async function fetchTodos() {
    setLoading(true);
    setError(null);
      try {
        const data = await getTodos({ is_completed: String(initialFilterCompleted) });
        if (!mounted) return;
        // console.log(data.results)
        setTodos(data.results);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.detail || err.message || "Failed to load todos");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTodos();

    return () => {
      mounted = false;
    };
  }, [initialFilterCompleted]);

  if (loading) return <div className="p-4">Loading todos…</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (todos.length === 0) return <div className="p-4 text-gray-600">No todos found.</div>;
  return (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todos.map((t) => (
          <TodoCard key={t.id} todo={t} />
          ))}
          </div>
        );
};

export default TodoList