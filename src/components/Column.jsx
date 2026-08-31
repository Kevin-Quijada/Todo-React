import { useDroppable } from '@dnd-kit/core';

export default function Column({ // Componente que representa una columna en la interfaz de usuario 
  id,
  title,
  count,
  badgeText,
  badgeClass,
  children,
  className = 'bg-white p-5 shadow-lg shadow-slate-900/5',
  titleClass = 'text-slate-500',
  countClass = 'text-slate-900',
}) {
  const { setNodeRef, isOver } = useDroppable({ id }); // useDroppable es un hook que permite hacer que un elemento sea un área donde se pueden soltar elementos arrastrables. setNodeRef es una función que se usa para referenciar el elemento y permitir que sea un área de soltar. isOver es un booleano que indica si hay un elemento arrastrable sobre el área de soltar

  return (
    <article
      ref={setNodeRef}
      className={`space-y-4 rounded-[7px] p-5 shadow-lg transition ${isOver ? 'ring-2 ring-emerald-400' : ''} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm uppercase tracking-[0.24em] ${titleClass}`}>{title}</p>
          <p className={`mt-2 text-3xl font-semibold ${countClass}`}>{count}</p>
        </div>

        {badgeText ? (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${badgeClass}`}>
            {badgeText}
          </span>
        ) : null}
      </div>

      {children}
    </article>
  );
}