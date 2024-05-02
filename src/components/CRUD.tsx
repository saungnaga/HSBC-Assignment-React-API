import React, { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const Crud: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState<string>("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTodoTitle,
            completed: false,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add todo");
      }
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodoTitle("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const startEditingTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditedTodoTitle(todo.title);
  };

  const updateTodo = async () => {
    if (!editingTodo) return;
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${editingTodo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editingTodo,
            title: editedTodoTitle,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      const updatedTodo = { ...editingTodo, title: editedTodoTitle };
      setTodos(
        todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
      setEditingTodo(null);
      setEditedTodoTitle("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };
  
  const toggleComplete = async (id: number) => {
    try {
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodos.find(todo => todo.id === id)),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center w-[80%]">
      <h1 className="font-bold mb-8 text-5xl text-white bg-black pt-2 pb-4 px-5 rounded">Just Do It ✓</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          className="border-gray-300 border rounded py-2 px-4 mr-2"
          placeholder="Enter new To-Do"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={addTodo}
        >
          Add To-Do
        </button>
      </div>
      <div className="bg-white p-2 rounded grid md:grid-cols-3 sm:grid-cols-2 gap-1">
        {todos.map((todo) => (
          <div key={todo.id} className="mb-2 border rounded p-2 flex flex-col gap-1 text-justify items-center text-wrap border-8 border-pink-800">
            {editingTodo?.id === todo.id ? (
              <>
                <input
                  type="text"
                  className="border-gray-300 border rounded py-1 px-2 mr-2"
                  value={editedTodoTitle}
                  onChange={(e) => setEditedTodoTitle(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white py-1 px-2 rounded mr-2 w-20"
                  onClick={updateTodo}
                >
                  Update
                </button>
                <button
                  className="bg-gray-500 text-white py-1 px-2 rounded"
                  onClick={() => setEditingTodo(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className={`mr-2 ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                  onClick={() => startEditingTodo(todo)}
                >
                  Edit
                </button>
                <button
                  className="bg-green-500 text-white py-1 px-2 rounded"
                  onClick={() => toggleComplete(todo.id)}
                >
                  Complete
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Crud;
