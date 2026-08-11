import React, { useEffect, useState } from 'react';

const Modal = ({ open, onClose, onSave, users, categories  }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('baja');
  const [status, setStatus] = useState('por_asignar');
  const [categoryId, setCategoryId] = useState('');
  const [assignedUser, setAssignedUser] = useState("");

  useEffect(() => {
    if (!open) return;

    setTitle('');
    setDescription('');
    setPriority('baja');
    setStatus('por_asignar');
    setCategoryId('');
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => { // aqui se agrega la logica para guardar la tarea, se llama a la funcion onSave que se pasa como prop desde el componente padre y se le pasa un objeto con los datos de la tarea, si la tarea se guarda correctamente se cierra el modal
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const saved = await onSave({
      title: trimmedTitle,
      description: description.trim(),
      priority,
      status,
      category_id: categoryId || null,
      user_id: assignedUser,
    });

    if (saved !== false) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold ">Nueva tarea</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h4>Titulo de La Tarea</h4>
          <input
            className="w-full rounded-lg border p-3"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full rounded-lg border p-3"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full rounded-lg border p-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="" disabled>
              Selecciona una prioridad
            </option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          <select
            className="w-full rounded-lg border p-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" disabled>
              Selecciona un estado
            </option>
            <option value="por_asignar">Por asignar</option>
            <option value="en_progreso">En progreso</option>
          </select>

          <select
            className="w-full rounded-lg border p-3"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="" disabled>
              Asignar usuario
            </option>

            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-white"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;