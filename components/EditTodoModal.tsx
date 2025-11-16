"use client";

import React, { useState } from "react";
import { updateTodo } from "@/services/TodoApi";
import type { Todo } from "@/types/type";

export default function EditTodoModal({
  todo,
  onClose,
  onSuccess,
}: {
  todo: Todo;
  onClose: () => void;
  onSuccess: (updated: Todo) => void;
}) {
  const [form, setForm] = useState({
    title: todo.title || "",
    description: todo.description || "",
    priority: todo.priority || "low",
    todo_date: todo.todo_date ? todo.todo_date.split("T")[0] : "",
    is_completed: todo.is_completed,
    position: todo.position ?? 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // priority behaves like single select; display as labelled checkbox-looking inputs
  const priorities = ["extreme", "moderate", "low"];

  const handlePriorityClick = (p: string) => {
    setForm((s) => ({ ...s, priority: p }));
  };

 const handleUpdate = async () => {
  setError(null);
  setLoading(true);

  try {
    const payload = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      todo_date: form.todo_date,
      is_completed: form.is_completed,
      position: form.position,
    };

    const updatedTodo = await updateTodo(todo.id, payload);

    onSuccess(updatedTodo);  // <-- CRITICAL
    onClose();

  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.detail || "Update failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
        {/* Go-back top-right */}
        <button onClick={onClose} className="absolute top-4 right-4 text-sm text-gray-600">
          Go back ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Todo</h2>

        {error && <div className="mb-3 text-red-600">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input className="w-full border p-2 rounded" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input type="date" className="w-full border p-2 rounded" value={form.todo_date} onChange={(e) => setForm({ ...form, todo_date: e.target.value })} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Priority</label>
            <div className="flex gap-4">
              {priorities.map((p) => (
                <label key={p} className={`fflex items-center gap-2 cursor-pointer ${form.priority === p}`}>
                  <input
                    type="checkbox"
                    checked={form.priority === p}
                    onChange={() => handlePriorityClick(p)}
                    className="w-4 h-4"
                  />
                  <span className="capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea className="w-full border p-2 rounded" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        {/* Buttons: Done bottom-left */}
        <div className="mt-6 flex justify-between items-center">
          <button onClick={handleUpdate} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
            {loading ? "Saving..." : "Done"}
          </button>

          {/* (No Delete button here by request) */}
          <div />
        </div>
      </div>
    </div>
  );
}
