import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaCheck } from "react-icons/fa";
import "./index.css"; // برای Tailwind CSS

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get("http://localhost:5000/todos");
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTitle.trim() && newDescription.trim() && newDate) {
      await axios.post("http://localhost:5000/todos", {
        title: newTitle,
        description: newDescription,
        completed: false,
        date: newDate,
      });
      setNewTitle("");
      setNewDescription("");
      setNewDate("");
      fetchTodos();
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    await axios.patch(`http://localhost:5000/todos/${id}`, {
      completed: !todo.completed,
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    fetchTodos();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">To-Do List</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border p-2 w-full rounded mb-2"
          placeholder="Title"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="border p-2 w-full rounded mb-2"
          placeholder="Description"
          rows="4"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border p-2 w-full rounded mb-2"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 rounded w-full flex items-center justify-center"
        >
          Add
        </button>
      </div>
      <ul className="list-disc list-inside">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex flex-col mb-4 p-4 border rounded-lg"
          >
            <h2
              className={`text-xl font-semibold ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.title}
            </h2>
            <p
              className={`mb-2 ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.description}
            </p>
            <p
              className={`text-sm text-gray-500 ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              Date: {new Date(todo.date).toLocaleDateString()}
            </p>
            <div className="flex items-center mt-2">
              <button
                onClick={() => toggleTodo(todo.id)}
                className="bg-green-500 text-white p-1 rounded mr-2 flex items-center justify-center"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 text-white p-1 rounded flex items-center justify-center"
              >
                <FaTrashAlt />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
