import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Status from './components/Status.jsx';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY); // Inicializa el cliente de Supabase con las variables de entorno


export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos()
  
  }, []);

  // LEER (Todas las Todos)
  async function getTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*, categories (id, name, color), users (id, name)') // Selecciona todos los campos de la tabla 'todos' y el campo 'name' de la tabla relacionada 'category_id';
      console.log('Todos:', data, error);
      if (error) {
        console.error('Error fetching todos:', error);
      } else {
        setTodos(data);
      }
    
    return { data, error };
  }


  // LEER (los todos por estado)
  

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-slate-900/10 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Tablero Todo</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Controla tus tareas y flujo de trabajo</h1>
            <p className="mt-3 max-w-2xl text-slate-300 sm:text-base">
              Organiza tareas por estado, revisa el progreso y mantén al equipo alineado con un tablero claro y moderno.
            </p>
          </div>

          {/* Tareas Pendientes */}
          <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center">
            <div className="rounded-3xl bg-slate-900/70 px-5 py-4 text-left shadow-lg shadow-slate-950/10 sm:px-6">
              <p className="text-sm text-slate-400">Tareas pendientes</p>
              <p className="mt-2 text-3xl font-semibold">14</p>
            </div>
            <div className="rounded-3xl bg-slate-900/70 px-5 py-4 text-left shadow-lg shadow-slate-950/10 sm:px-6">
              <p className="text-sm text-slate-400">Equipos</p>
              <p className="mt-2 text-3xl font-semibold">3</p>
            </div>
          </div>
        </header>

        {/* Resumen de las tareas activas (Por hacer) */}
        <main className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/5">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Resumen rápido</p>
              <div className="rounded-3xl bg-slate-100 p-5">
                <p className="text-sm text-slate-500">Hoy</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">6 tareas activas</p>
                <p className="mt-2 text-sm text-slate-600">Sigue el progreso diario y mantén el tablero limpio.</p>
              </div>
            </div>

            {/* Recordatorio de las entregas */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Próximas entregas</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm shadow-slate-200/50">
                  {todos.map((todo) => (
                    <div key={todo.id} className="mt-2 text-xs text-slate-400">
                    <p className="text-sm font-medium text-slate-900">{todo.title}</p>
                    <p className="mt-1 text-xs text-slate-500">Entregar antes del viernes</p>
                    </div>
                  ))
                  }
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm shadow-slate-200/50">
                  <p className="text-sm font-medium text-slate-900">Revisar backlog</p>
                  <p className="mt-1 text-xs text-slate-500">Reunión de equipo mañana</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Tablero de tareas */}
          <section className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Tablero de tareas</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Flujo de trabajo actual</h2>
              </div>
              <button className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                + Nueva tarea
              </button>
            </div>

            {/* Tareas para asignar al equipo */}
            <div className="grid gap-6 xl:grid-cols-3">
              <article className="space-y-4 rounded-3xl bg-slate-900/95 p-5 text-white shadow-xl shadow-slate-900/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Por asignar</p>
                    <p className="mt-2 text-3xl font-semibold">5</p>
                  </div>
                  <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Nuevo</span>
                </div>

                {/* Card de tarea por asignar */}
                {todos.map((todo) => (
                    <div className="space-y-4">
                      <article className="rounded-3xl bg-slate-950/80 p-4">
                        <div key={todo.id} className="flex items-center justify-between gap-4">
                          <h3 className="text-lg font-semibold">{todo.title}</h3>
                          <span className={`rounded-full ${todo.categories?.color === 'negro' ? 'bg-slate-500' : todo.categories?.color === 'azul' ? 'bg-blue-500' : 'bg-amber-500/15' } px-3 py-1 text-xs font-semibold text-white`}>{todo.categories?.name}</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-400">{todo.description}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                          <img src="" alt="" /> {/* Imagen de Usuario */}
                          {/* <span>{todo.deadline}</span> */} {/* Tiempo limite de entrega */}
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${todo.priority === 'alta' ? 'bg-rose-100 text-rose-700' :  todo.priority === 'media' ? 'bg-amber-100 text-amber-700' : todo.priority === 'baja' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
                            {todo.priority === 'alta' ? 'Alta Prioridad' : todo.priority === 'media' ? 'Media prioridad' : 'Baja Prioridad'}
                          </span>
                        </div>
                      </article>
                    </div>
                ))}
              </article>

              {/* Tareas en progreso */}
              <article className="space-y-4 rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">En progreso</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">6</p>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Activo</span>
                </div>

                {/* Card de tareas en progreso */}
                {todos.filter(todo => todo.status === 'en progreso' || todo.status === 'activo').map((todo) => ( // Filtra los todos que están en progreso o activos y los mapea para mostrarlos
                  <div key={todo.id} className="space-y-4">
                    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-slate-900">{todo.title}</h3>
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">60%</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{todo.description}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span>{new Date(todo.deadline).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke-width="1.5" 
                          stroke="currentColor" 
                          class="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors">
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          {todo.users?.name}
                        </div>
                        
                      </div>
                    </article>
                  </div>
                ))}
              </article>

              {/* Tareas completadas */}
              <article className="space-y-4 rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Completadas</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">3</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Hecho</span>
                </div>

                <div className="space-y-4">
                  <article className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-900">Revisar tickets</h3>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">100%</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">Actualizar estados y cerrar incidencias urgentes.</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>Completo</span>
                      <span>Hoy</span>
                    </div>
                  </article>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500 shadow-inner shadow-slate-900/5">
        © 2026 Mi Aplicación. Todos los derechos reservados.
      </footer>
    </div>
  );
}
