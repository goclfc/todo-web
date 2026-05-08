import { useEffect, useState, type FormEvent } from 'react';
import { api, type Todo } from './api';

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.list().then(setTodos).catch((e) => setError(String(e)));
  }, []);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const created = await api.create(t);
    setTodos((prev) => [created, ...prev]);
    setTitle('');
  }

  async function onToggle(todo: Todo) {
    const updated = await api.update(todo.id, { completed: !todo.completed });
    setTodos((prev) => prev.map((x) => (x.id === todo.id ? updated : x)));
  }

  async function onDelete(id: number) {
    await api.remove(id);
    setTodos((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <main className="container">
      <h1>Todos</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onAdd} className="add-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo title"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="list">
        {todos.map((t) => (
          <li key={t.id} className={t.completed ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => onToggle(t)}
              />
              <span>{t.title}</span>
            </label>
            <button onClick={() => onDelete(t.id)} aria-label="delete">
              ×
            </button>
          </li>
        ))}
        {todos.length === 0 && <li className="empty">No todos yet.</li>}
      </ul>
    </main>
  );
}
