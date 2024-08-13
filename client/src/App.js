import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      const response = await axios.get('http://localhost:5000/todos');
      setTodos(response.data);
    }
    fetchTodos();
  }, []);

  const addTodo = async () => {
    const newTodo = { text, completed };
    await axios.post('http://localhost:5000/todos', newTodo);
    setText('');
    setCompleted(false);
    const response = await axios.get('http://localhost:5000/todos');
    setTodos(response.data);
  };

  const updateTodo = async (id, updates) => {
    await axios.put(`http://localhost:5000/todos/${id}`, updates);
    const response = await axios.get('http://localhost:5000/todos');
    setTodos(response.data);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    const response = await axios.get('http://localhost:5000/todos');
    setTodos(response.data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded p-2 mr-2"
          placeholder="Add a new todo"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                updateTodo(todo._id, { completed: !todo.completed })
              }
              className="mr-2"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="bg-red-500 text-white p-2 rounded ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
