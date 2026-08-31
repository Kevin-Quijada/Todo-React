import React from 'react';

const TodoFilters = ({
  search, // Estos son parametros que se pasan desde el componente padre (List.jsx) y se utilizan para mostrar el valor actual de búsqueda en el input.
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  className = '',
}) => {
  const clearFilters = () => {
    setSearch(''); // Estos son parametros que se pasan desde el componente padre (List.jsx) y se utilizan para actualizar el estado de búsqueda en el componente padre.
    setStatusFilter('');
    setPriorityFilter('');
  };

  return (
    <div className={`rounded-[7px] border border-slate-700 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 shadow-2xl shadow-slate-900/10 ${className}`}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Buscar tareas</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">🔎</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)} 
            placeholder="Buscar por título o descripción..."
            className="w-full rounded-[7px] border border-white/10 bg-white/10 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white/15"
          />
        </label>

        <label className="min-w-[190px]">
          <span className="sr-only">Filtrar por estado</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-[7px] border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white outline-none transition focus:border-indigo-400 focus:bg-white/15"
          >
            <option value="" className="text-slate-900">Todos los estados</option>
            <option value="por_asignar" className="text-slate-900">Por asignar</option>
            <option value="en_progreso" className="text-slate-900">En progreso</option>
            <option value="completada" className="text-slate-900">Completadas</option>
          </select>
        </label>

        <label className="min-w-[170px]">
          <span className="sr-only">Filtrar por prioridad</span>
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="w-full rounded-[7px] border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white outline-none transition focus:border-indigo-400 focus:bg-white/15"
          >
            <option value="" className="text-slate-900">Todas las prioridades</option>
            <option value="alta" className="text-slate-900">Alta</option>
            <option value="media" className="text-slate-900">Media</option>
            <option value="baja" className="text-slate-900">Baja</option>
          </select>
        </label>

        {(search || statusFilter || priorityFilter) && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-[10px] border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoFilters;