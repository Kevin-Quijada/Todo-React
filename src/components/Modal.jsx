import React, { useEffect, useState } from 'react';

const Modal = ({ open, onClose, onSave, users, categories }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Nueva tarea
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Crea una tarea y define sus detalles, prioridad y responsable.
                </p>
              </div>
            </div>

            {/* Botón cerrar */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">

          {/* Información principal */}
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Información de la tarea
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Describe qué se debe realizar.
              </p>
            </div>

            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Título
                  <span className="ml-1 text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                  placeholder="Ej. Preparar informe mensual"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Descripción
                </label>

                <textarea
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                  placeholder="Describe los detalles, objetivos o instrucciones de la tarea..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Configuración
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Define cómo se organizará esta tarea.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Prioridad */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Prioridad
                </label>

                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona una prioridad
                  </option>

                  <option value="alta">🔴 Alta</option>
                  <option value="media">🟡 Media</option>
                  <option value="baja">🟢 Baja</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estado inicial
                </label>

                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona un estado
                  </option>

                  <option value="por_asignar">
                    📋 Por asignar
                  </option>

                  <option value="en_progreso">
                    🔄 En progreso
                  </option>
                </select>
              </div>

              {/* Categoría */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Categoría
                </label>

                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
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
              </div>

              {/* Usuario */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Asignar a
                </label>

                <select
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                >
                  <option value="" disabled>
                    Selecciona un usuario
                  </option>

                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
            >
              Crear tarea
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Modal;