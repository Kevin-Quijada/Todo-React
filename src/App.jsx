import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DndContext } from '@dnd-kit/core';
import Column from './components/Column.jsx';
import TodoCard from './components/TodoCard.jsx';
import Header from './components/Header.jsx';

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

  // Cambiar el estado de una tarea
  async function moverTodo(todoId, nuevoEstado) {
    const { error } = await supabase
      .from('todos')
      .update({
        status: nuevoEstado // Actualiza el campo 'status' de la tarea con el nuevo estado
      })
      .eq('id', todoId) // Filtra la tarea por su ID para actualizar solo esa tarea

    if (error) {
      console.error(error)
      return
    }

    getTodos()
  }

  function handleDragEnd(event) { // Función que se ejecuta cuando se termina de arrastrar un elemento
    const { active, over } = event; // Obtiene el elemento activo (el que se está arrastrando) y el elemento sobre el que se soltó

    if (!over) return; //si no hay un elemento sobre el que se soltó, no hace nada es decir, si el usuario suelta la tarea fuera de una columna, no se hace nada

    const todoId = Number(active.id);
    const nuevoEstado = String(over.id);

    if (!Number.isNaN(todoId) && nuevoEstado) { //si el ID de la tarea es un número válido y hay un nuevo estado, llama a la función moverTodo para actualizar el estado de la tarea
      moverTodo(todoId, nuevoEstado);
    }
  }

  const porAsignarTodos = todos.filter( // filtra las tareas que están en estado "por asignar", "nuevo" o "pendiente"
    (todo) => !todo.status || todo.status === 'por asignar' || todo.status === 'nuevo' || todo.status === 'pendiente'
  );
  const enProgresoTodos = todos.filter(
    (todo) => todo.status === 'en progreso' || todo.status === 'activo'
  );
  const completadasTodos = todos.filter(
    (todo) => todo.status === 'completada' || todo.status === 'terminada' || todo.status === 'done'
  );

  return (
    <>
    <Header/>    

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <header className="mb-8 rounded-3xl bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-slate-900/10 sm:flex sm:items-center sm:justify-between">

            {/*   */}
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


              {/* Todas las columnas */}
              <DndContext onDragEnd={handleDragEnd}> {/* dndContext es el contenedor para el manejo del arrastre y colocación importado a travez de @dnd-kit/core libreria especial para esto*/}
              
                <div className="grid gap-6 xl:grid-cols-3">
                  <Column
                    id="por asignar"
                    title="Por asignar"
                    count={porAsignarTodos.length}
                    badgeText="Nuevo"
                    badgeClass="bg-slate-700 text-slate-300"
                    className="bg-slate-900/95 p-5 text-white shadow-xl shadow-slate-900/10"
                    titleClass="text-slate-400"
                    countClass="text-white"
                  >
                    {porAsignarTodos.map((todo) => (
                      <div key={todo.id} className="space-y-4">
                        <TodoCard
                          todo={todo}
                          onMove={moverTodo}
                          actionLabel="Mover a progreso"
                          actionTarget="en progreso"
                          className="bg-slate-950/80 text-white"
                        />
                      </div>
                    ))}
                  </Column>

                  <Column
                    id="en progreso"
                    title="En progreso"
                    count={enProgresoTodos.length} // enProgresoTodos.length sive para mostrar el número de tareas en progreso
                    badgeText="Activo"
                    badgeClass="bg-sky-100 text-sky-700"
                    className="bg-white p-5 shadow-lg shadow-slate-900/5"
                    titleClass="text-slate-500"
                    countClass="text-slate-900"
                  >
                    {enProgresoTodos.map((todo) => (
                      <div key={todo.id} className="space-y-4">
                        <TodoCard
                          todo={todo}   // Pasa la tarea actual al componente TodoCard
                          onMove={moverTodo} // Función para mover la tarea a otra columna
                          actionLabel="Completar"
                          actionTarget="completada"
                          className="border border-slate-200 bg-slate-50 text-slate-900"
                        />
                      </div>
                    ))}
                  </Column>

                  <Column
                    id="completada"
                    title="Completadas"
                    count={completadasTodos.length} // completadasTodos.length sive para mostrar el número de tareas completadas
                    badgeText="Hecho"
                    badgeClass="bg-emerald-100 text-emerald-700"
                    className="bg-white p-5 shadow-lg shadow-slate-900/5"
                    titleClass="text-slate-500"
                    countClass="text-slate-900"
                  >
                    {completadasTodos.map((todo) => (
                      <div key={todo.id} className="space-y-4">
                        <TodoCard
                          todo={todo} // Pasa la tarea actual al componente TodoCard
                          onMove={moverTodo}  // Función para mover la tarea a otra columna
                          actionLabel="Volver a pendiente"
                          actionTarget="por asignar"
                          className="border border-slate-200 bg-slate-50 text-slate-900"
                        />
                      </div>
                    ))}
                  </Column>
                </div>
              </DndContext>
            </section>
          </main>
        </div>   
      </div>
    </>
  );
}
