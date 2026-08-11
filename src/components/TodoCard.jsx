import { useDraggable } from '@dnd-kit/core';

const priorityStyles = {
  alta: 'bg-red-400 text-white',
  media: 'bg-amber-400 text-slate-900',
  baja: 'bg-emerald-400 text-white',
  default: 'bg-slate-300 text-white',
};

export default function TodoCard({
  todo,
  onMove,
  actionLabel,
  actionTarget,
  className = 'bg-slate-950/80 text-white',
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ // useDraggable es un hook que permite hacer que un elemento sea arrastrable
    id: String(todo?.id ?? 'todo'),
  });

  const style = transform // si el elemento se está arrastrando, aplica una transformación para moverlo a la posición del cursor y cambia su opacidad a 0.7, de lo contrario, no aplica ningún estilo
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      opacity: isDragging ? 0.7 : 1,
    }
    : undefined;

  const priorityKey = todo?.priority?.toLowerCase(); // Obtiene la prioridad de la tarea en minúsculas, si no existe, será undefined
  const priorityClass = priorityStyles[priorityKey] ?? priorityStyles.default; // Obtiene la clase de estilo correspondiente a la prioridad, si no existe, usa la clase por defecto
  const priorityLabel = // Obtiene la etiqueta de prioridad correspondiente a la clave de prioridad es para mantener la consistencia de la etiqueta de prioridad en español, si no existe, muestra "Sin prioridad"
    priorityKey === 'alta'
      ? 'Alta'
      : priorityKey === 'media'
        ? 'Media'
        : priorityKey === 'baja'
          ? 'Baja'
          : 'Sin prioridad';


  return (
    <article
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group cursor-grab rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-md transition-all duration-100 hover:-translate-y-1 hover:border-slate-500 hover:shadow-xl active:cursor-grabbing ${className}`}
    >
      
      <div className="space-y-4 mt-2 border-x border-y border-slate-700  text-sm text-slate-400">

        {/* Categoría */}
        <div className="flex items-center justify-between border-y boder-x border-slate-700 py-3 px-3 text-sm text-slate-400">

          {todo?.categories && (
            <span
              className="rounded-full px-1 py-1 text-xs font-semibold text-white"
              style={{
                backgroundColor:
                  todo.categories.color || "#475569",
              }}
            >
              {todo.categories.name}
            </span>
          )}

          <span
            className={`rounded-full px-3 text-xs font-semibold ${priorityClass}`}
          >
            {priorityLabel}
          </span>

        </div>

        {/* Título */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white leading-tight">
            {todo?.title
              ?.toLowerCase()
              .replace(/\b\w/g, letra => letra.toUpperCase()) ??
              "Sin título"}
          </h3>
        </div>

        {/* Descripción */}
        <p className="line-clamp-3 bg-slate-800 p-3 text-sm leading-relaxed text-slate-300">
          {todo?.description || "Sin descripción"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-b border-slate-700 pt-3 pb-3 p-3 text-xs text-slate-400">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 font-bold text-white">
              {todo?.assigned_user?.name?.charAt(0).toUpperCase() || "?"}
            </div>

            <div>
              <p className="font-medium text-slate-200">
                {todo?.assigned_user?.name || "Sin asignar"}
              </p>

              <p>
                {todo?.deadline
                  ? new Date(todo.deadline).toLocaleDateString("es-MX")
                  : "Sin fecha"}
              </p>
            </div>

          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-slate-500 group-hover:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9h8M8 15h8"
            />
          </svg>

        </div>

      </div>

      <div className="flex justify-center mt-4">
        <div className="h-1.5 w-12 rounded-full bg-slate-600 group-hover:bg-slate-400 transition-colors"></div>
      </div>
    </article>
  );
}