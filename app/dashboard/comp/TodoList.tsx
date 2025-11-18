"use client";

import { getTodos, updateTodo } from "@/services/TodoApi";
import { Todo } from "@/types/type";
import React, { useEffect, useState } from "react";
import TodoCard from "./TodoCard";
import NewTodoModal from "@/components/TodoModal";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";


const TodoList = ({ initialFilterCompleted = true }: { initialFilterCompleted?: boolean }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

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

  useEffect(() => {
    let result = [...todos];

    const today = new Date();

    // Filter by deadline
    if (filterType) {
      result = result.filter(todo => {
        if (!todo.todo_date) return false;

        const deadline = new Date(todo.todo_date);
        const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (filterType === "today") return diffDays === 0;
        if (filterType === "5days") return diffDays <= 5;
        if (filterType === "10days") return diffDays <= 10;
        if (filterType === "30days") return diffDays <= 30;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTodos(result);
  }, [searchQuery, filterType, todos]);


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

  function reorder(list: Todo[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result.map((item, index) => ({
      ...item,
      position: index + 1,
    }));
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    // UI reorder
    const newOrder = reorder(filteredTodos, result.source.index, result.destination.index);
    setFilteredTodos(newOrder);

    // sync with backend
    try {
      await Promise.all(
        newOrder.map(todo =>
          updateTodo(todo.id, { position: todo.position })
        )
      );
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  }




  if (loading) return <div className="p-4">Loading todos…</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="relative">
      <div className="flex flex-row 
        items-center 
        justify-between 
        gap-[664px]
        w-[1100px] 
        h-[88px] 
        ml-[0px]
        pl-[10px] 
        pr-[80px] 
       bg-white overflow-hidden">
        <h1 className="text-3xl font-bold">TODO</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-indigo-600 text-white px-4 mr-6 py-2 rounded hover:bg-indigo-700"
        >
          + New Todo
        </button>
      </div>
      <div className="flex flex-row 
    			items-center 
    			justify-between 
    			w-[1100px] 
    			h-[88px] 
    			ml-[0px]
    			pl-[10px] 
    			pr-[80px] 
          gap-80
    		bg-white overflow-hidden">
        <input
          type="text"
          placeholder="Search todos by title..."
          className="border px-3 py-2 rounded w-4/5"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded mr-6"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Filter by</option>
          <option value="today">Deadline Today</option>
          <option value="5days">Expires in 5 Days</option>
          <option value="10days">Expires in 10 Days</option>
          <option value="30days">Expires in 30 Days</option>
        </select>
      </div>

      {openModal && (
        <NewTodoModal
          onClose={() => setOpenModal(false)}
          onSuccess={fetchTodos}
        />
      )}

      {filteredTodos.length === 0 ? (
        <div className="p-4 text-gray-600">
          <h1>No matching task found</h1>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + New Todo
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todoList">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredTodos.map((t, index) => (
                  <Draggable key={t.id} draggableId={String(t.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TodoCard
                          todo={t}
                          onDelete={handleDeleteTodo}
                          onUpdate={handleUpdateTodo}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

      )}
    </div>
  );
};

export default TodoList;
