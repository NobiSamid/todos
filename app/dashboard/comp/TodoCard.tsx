"use client";

import EditTodoModal from "@/components/EditTodoModal";
import { deleteTodo } from "@/services/TodoApi";
import { Todo } from "@/types/type";
import { IconEdit, IconTrash } from "@tabler/icons-react";
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
      <article className="rounded-xl p-4 shadow-md gap-4 mx-4 my-4 bg-white relative">
        <div className="flex items-start justify-between">
          <h3 className={`text-lg font-semibold ${is_completed ? "line-through text-gray-400" : ""}`}>
            {title}
          </h3>
          <span className={`px-2 py-1 text-xs rounded ${priorityBadge()}`}>
            {priority}
          </span>
        </div>

        {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}

        <div className="mt-3 flex items-center text-xs text-gray-500">
          <div>
            {is_completed ? (
              <span className="text-green-600 font-medium">Completed</span>
            ) : (
              <span className="text-orange-600 font-medium">Due</span>
            )}
          </div>
          <div className="p-4">{todo_date}</div>         
        </div>

        <div className="flex justify-between items-center gap-2 mt-4">
          <div />

          <div className="flex gap-2">
            <button
              onClick={() => setOpenEdit(true)}
              className="p-1 rounded hover:bg-blue-300"
            >
              <IconEdit className="text-blue-400 text-sm" />
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              className="p-1 rounded hover:bg-red-300"
            >
              <IconTrash className=" text-red-400 text-sm" />
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
