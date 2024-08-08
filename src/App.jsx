import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaCheck, FaEdit } from "react-icons/fa";
import "./index.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    // Load todos from local storage
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(savedTodos);
  }, []);

  useEffect(() => {
    // Save todos to local storage
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

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

  const updateTodo = async (id) => {
    if (editTitle.trim() && editDescription.trim() && editDate) {
      await axios.patch(`http://localhost:5000/todos/${id}`, {
        title: editTitle,
        description: editDescription,
        date: editDate,
      });
      setEditing(null);
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

  const handleEditClick = (todo) => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditDate(todo.date);
    setEditing(todo.id);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  const sortedTodos = filteredTodos.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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

      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <ul className="list-disc list-inside">
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex flex-col mb-4 p-4 border rounded-lg"
          >
            {editing === todo.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border p-2 w-full rounded mb-2"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border p-2 w-full rounded mb-2"
                  rows="4"
                />
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="border p-2 w-full rounded mb-2"
                />
                <button
                  onClick={() => updateTodo(todo.id)}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
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
                    onClick={() => handleEditClick(todo)}
                    className="bg-yellow-500 text-white p-1 rounded mr-2 flex items-center justify-center"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-500 text-white p-1 rounded flex items-center justify-center"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
