"use client";

import { createTodo } from "@/services/TodoApi";
import React, { useState } from "react";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function NewTodoModal({ onClose, onSuccess }: Props) {

  const [title, setTitle] = useState("");
  const [todo_date, setDate] = useState("");
  const [priority, setPriority] = useState("moderate");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      await createTodo({
        title,
        description,
        priority,
        todo_date,
      });

      onSuccess();  // refresh list
      onClose();    // close modal
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.detail || "Failed to create Todo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative absolute w-[591px] h-[653px] p-10 gap-4 rounded-[16px] opacity-100">

        <h2 className="text-xl font-semibold mb-4">Create New Todo</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="space-y-4">

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={todo_date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block mb-1 font-medium">Priority</label>
            <div className="flex gap-4">
              {["extreme", "moderate", "low"].map((p) => (
                <label key={p} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              rows={3}
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Done"}
          </button>
        </div>

      </div>
    </div>
  );
}
