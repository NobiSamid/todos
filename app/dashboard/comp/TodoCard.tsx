"use client";

import EditTodoModal from "@/components/EditTodoModal";
import { deleteTodo } from "@/services/TodoApi";
import { Todo } from "@/types/type";
import { useState } from "react";

export default function TodoCard({
  todo,
  onUpdate,
  onDelete,
}: {
  todo: Todo;
  onUpdate: (updated: Todo) => void;   // FIXED
  onDelete: (id: number) => void;      //  FIXED
}) {
  const { id, title, description, priority, is_completed, todo_date } = todo;
  const [openEdit, setOpenEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const priorityBadge = () => {
    switch (priority) {
      case "extreme":
        return "bg-red-100 text-red-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTodo(id);
      setShowConfirm(false);
      onDelete(id);              // MUST PASS ID
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <article className="border rounded-xl p-4 shadow-md bg-white relative">
        <div className="flex items-start justify-between">
          <h3 className={`text-lg font-semibold ${is_completed ? "line-through text-gray-400" : ""}`}>
            {title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded ${priorityBadge()}`}>
            {priority}
          </span>
        </div>

        {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div>{todo_date}</div>
          <div>
            {is_completed ? (
              <span className="text-green-600 font-medium">Completed</span>
            ) : (
              <span className="text-orange-600 font-medium">Pending</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 mt-4">
          <div />

          <div className="flex gap-2">
            <button
              onClick={() => setOpenEdit(true)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </article>

      {openEdit && (
        <EditTodoModal
          todo={todo}
          onClose={() => setOpenEdit(false)}
          onSuccess={(updatedTodo) => onUpdate(updatedTodo)}   //  pass updated todo
        />
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none">
          <div className="mb-8 bg-white p-4 border rounded-lg shadow-lg pointer-events-auto w-80 text-center">
            <p className="mb-3 font-medium">Are you sure you want to delete this task?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-1 bg-gray-200 rounded">
                No
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-1 bg-red-600 text-white rounded"
              >
                {deleting ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
