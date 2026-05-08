export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  list: () => fetch(`${BASE}/todos`).then(json<Todo[]>),
  create: (title: string) =>
    fetch(`${BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then(json<Todo>),
  update: (id: number, patch: Partial<Pick<Todo, 'title' | 'completed'>>) =>
    fetch(`${BASE}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }).then(json<Todo>),
  remove: (id: number) =>
    fetch(`${BASE}/todos/${id}`, { method: 'DELETE' }).then(json<void>),
};
