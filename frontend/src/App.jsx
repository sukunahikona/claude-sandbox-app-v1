import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const loadTodos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/todos`)
      if (!res.ok) throw new Error('Failed to load todos')
      setTodos(await res.json())
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const res = await fetch(`${API_BASE}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (res.ok) {
      setTitle('')
      loadTodos()
    }
  }

  const toggleTodo = async (todo) => {
    const res = await fetch(`${API_BASE}/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo.done }),
    })
    if (res.ok) loadTodos()
  }

  const deleteTodo = async (id) => {
    const res = await fetch(`${API_BASE}/api/todos/${id}`, { method: 'DELETE' })
    if (res.ok) loadTodos()
  }

  return (
    <div className="app">
      <h1>Sandbox Todo</h1>
      <p className="subtitle">FastAPI + React</p>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="やることを入力..."
        />
        <button type="submit">追加</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo)}
              />
              {todo.title}
            </label>
            <button onClick={() => deleteTodo(todo.id)} aria-label="delete">
              ✕
            </button>
          </li>
        ))}
        {todos.length === 0 && <li className="empty">まだタスクがありません</li>}
      </ul>
    </div>
  )
}

export default App
