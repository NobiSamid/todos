"use client";

import { Todo } from "@/types/type";


export default function TodoCard({ todo }: { todo: Todo }) {
  const { title, description, priority, is_completed, todo_date } = todo;

  const priorityBadge = () => {
    switch (priority) {
      case "extreme":
        return "bg-red-100 text-red-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <article className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex items-start justify-between">
        <h3 className={`text-lg font-semibold ${is_completed ? "line-through text-gray-400" : ""}`}>
          {title}
        </h3>

        <span className={`px-2 py-1 text-xs font-medium rounded ${priorityBadge()}`}>
          {priority ?? "—"}
        </span>
      </div>

      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div>
          {todo_date ? new Date(todo_date).toLocaleDateString() : "No date"}
        </div>
        <div>
          {is_completed ? (
            <span className="text-green-600 font-medium">Completed</span>
          ) : (
            <span className="text-orange-600 font-medium">Pending</span>
          )}
        </div>
      </div>
    </article>
  );
}
