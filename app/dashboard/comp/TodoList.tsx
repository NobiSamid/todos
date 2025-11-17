"use client";

import { getTodos } from "@/services/TodoApi";
import { Todo } from "@/types/type";
import React, { useEffect, useState } from "react";
import TodoCard from "./TodoCard";
import NewTodoModal from "@/components/TodoModal";
import { Router } from "next/router";

const TodoList = ({ initialFilterCompleted = true }: { initialFilterCompleted?: boolean }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  async function fetchTodos() {
    setLoading(true);
    setError(null);

    try {
      const data = await getTodos({ is_completed: String(initialFilterCompleted) });
      setTodos(data.results);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [initialFilterCompleted]);

  //  Instant Delete
  const handleDeleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  //  Instant Update
  const handleUpdateTodo = (updated: Todo) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === updated.id ? updated : todo
      )
    );
  };

  if (loading) return <div className="p-4">Loading todos…</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + New Todo
        </button>
      </div>

      {todos.length === 0 ? (
        <div className="p-4 text-gray-600">
          <h1>no task to do</h1>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + New Todo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todos.map((t) => (
            <TodoCard
              key={t.id}
              todo={t}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
            />
          ))}
        </div>
      )}

      {openModal && (
        <NewTodoModal
          onClose={() => setOpenModal(false)}
          onSuccess={fetchTodos}
        />
      )}
    </div>
  );
};

export default TodoList;
