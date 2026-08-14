import { useState, useEffect } from 'react';

export default function EditModal({ open, onClose, todo, onSave, categories = [], users = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setCategoryId(todo.categories?.id || '');
      setPriority(todo.priority || '');
      setAssignedUserId(todo.assigned_user?.id || '');
      setDeadline(todo.deadline ? new Date(todo.deadline).toISOString().slice(0, 10) : '');
    }
  }, [todo]);

  if (!open) return null;

  async function handleSave(e) {
    e.preventDefault();
    const updatedFields = {
      title,
      description,
      category_id: categoryId || null,
      priority: priority || null,
      user_id: assignedUserId || null,
      deadline: deadline || null,
    };

    await onSave(todo.id, updatedFields);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSave} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editar tarea</h3>
          <button type="button" onClick={onClose} className="text-slate-500">Cerrar</button>
        </div>

        <div className="mt-4 grid gap-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="w-full rounded-md border px-3 py-2" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" className="w-full rounded-md border px-3 py-2" />

          <div className="grid grid-cols-2 gap-4">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="rounded-md border px-3 py-2">
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-md border px-3 py-2">
              <option value="">Sin prioridad</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select value={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)} className="rounded-md border px-3 py-2">
              <option value="">Sin asignar</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name || u.email}</option>
              ))}
            </select>

            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="rounded-md border px-3 py-2" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2">Cancelar</button>
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-white">Guardar</button>
        </div>
      </form>
    </div>
  );
}
