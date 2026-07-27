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
      ref={setNodeRef} // setNodeRef es una función que se usa para referenciar el card de la tarea y permitir que sea arrastrable
      style={style} // Aplica los estilos de transformación y opacidad al card de la tarea
      {...listeners} // listeners es un objeto que contiene los eventos necesarios para manejar el arrastre del card de la tarea
      {...attributes} // attributes es un objeto que contiene los atributos necesarios para manejar el arrastre del card de la tarea. los atributos incluyen el id del card de la tarea y el rol de "button" para que sea accesible
      className={`rounded-3xl p-4 cursor-grab ${className}`}
    >
      <div className="flex col flex-col gap-2">
        <div>
          <h3 className="text-lg font-semibold">{todo?.title ?? 'Sin título'}</h3>
          <p className="mt-3 text-sm text-slate-400">
            {todo?.description ?? 'Sin descripción'}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
            <div>
                {todo?.categories?.name ? (
                <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                    {todo.categories.name}
                </span>
                ) : null} 
            </div>
            
            <div className="flex items-center gap-2">
                <span className={`rounded-full ${priorityClass} px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300`}> {/* El priorityClass es una clase para mostrar el estilo del boton dependiendo de su prioridad */}
                {priorityLabel} {/* priorityLabel es la etiqueta de prioridad en español. En este caso solo hay 3 niveles: Alta, Media, Baja y se mostrara el color correspondiente gracias a la clase priorityClass */}
                </span>
            </div>
        </div>
        
      </div>

      
    </article>
  );
}