import { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { supabase } from '../supabaseClient.js';
import Column from '../components/Column.jsx';
import TodoCard from '../components/TodoCard.jsx';
import EditModal from '../components/EditModal.jsx';
import Header from '../components/Header.jsx';
import UserAuthSection from '../components/UserAuthSection.jsx';
import Modal from '../components/Modal.jsx';
import { getCurrentSession, signOutUser, subscribeToAuth } from '../services/AuthServices.js';
import { getTodos, getUsers, createTodo, updateTodo } from '../services/TodoServices.js';
import { getCategories } from '../services/TodoCategories.js';
import { filterTodos } from '../utils/todoFilters.js';
import TodoFilters from '../components/TodoFilters.jsx';

export default function Inicio() {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  function openEditModal(todo) {
    // cerrar modal de crear si está abierto
    setIsOpen(false);
    setEditingTodo(todo);
  }


  /* Cargar de los Todos */
  async function loadTodos() {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  }

  /* Cargar de los Usuarios */
  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  /* Cargar categorias */
  async function loadCategories() {
    const { data, error } = await getCategories();

    if (!error) {
      setCategories(data);
    }
  }

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const currentSession = await getCurrentSession();
        if (isMounted) {
          setSession(currentSession);
        }
      } catch (error) {
        console.error('Error al cargar la sesión:', error);
      }
    };

    initAuth();

    const unsubscribe = subscribeToAuth((nextSession) => {
      if (isMounted) {
        setSession(nextSession);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadTodos();
      loadUsers(); // Llamada a la función para obtener la lista de usuarios
      loadCategories();
    }
  }, [session]);


  /* Función para mover una tarea a un nuevo estado */
  async function moverTodo(todoId, nuevoEstado) {
    const { error } = await supabase
      .from('todos')
      .update({
        status: nuevoEstado,
      })
      .eq('id', todoId);

    if (error) {
      console.error("Error al mover la tarea:", error);
      return;
    }

    await loadTodos(); // Recargar la lista de tareas después de mover una tarea
  }


  /* Función para cerrar sesión */
  async function handleSignOut() {
    try {
      await signOutUser();
      setSession(null);
      setMessage('Has cerrado sesión.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const todoId = Number(active.id);
    const nuevoEstado = String(over.id);
    if (!Number.isNaN(todoId) && nuevoEstado) {
      moverTodo(todoId, nuevoEstado);
    }
  }


  const filteredTodos = filterTodos(todos, search, statusFilter, priorityFilter, '');

  const porAsignarTodos = filteredTodos.filter(
    todo => todo.status === 'por_asignar'
  );

  const enProgresoTodos = filteredTodos.filter(
    todo => todo.status === 'en_progreso'
  );

  const completadasTodos = filteredTodos.filter(
    todo => todo.status === 'completada'
  );

  async function handleCreateTodo(todo) {
    try {
      console.time("crear tarea");

      const newTodo = await createTodo(todo);

      console.timeEnd("crear tarea");

      if (!newTodo) return false;

      setTodos((prevTodos) => [ /* prevTodos representa el estado mas reciente de los todos asi es mas comodo que pedir los datos de supabase, es mas rapido y mas eficiente asi los procesos tardan menos es mostrarse */
        ...prevTodos, /* Los (...) se llaman spread operator y sirven para copiar los elementos del array. */
        newTodo,
      ]);

      return true;

    } catch (error) {
      console.error("Error creando tarea:", error);
      return false;
    }
  }

  async function handleUpdateTodo(id, updatedFields) {
    try {
      const updatedTodo = await updateTodo(id, updatedFields);
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      return true;
    } catch (error) {
      console.error("Error actualizando tarea:", error);
      return false;
    }
  }


  return (
    <>
      <Header session={session} onSignOut={handleSignOut} setAuthMode={setAuthMode} />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef2ff_28%,_#f8fafc_55%,_#f1f5f9_100%)] text-slate-900">
        <div id="inicio" className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          {!session ? (
            <UserAuthSection authMode={authMode} setAuthMode={setAuthMode} />
          ) : (
            <>
            {/* Header - Navegador */}
              <header className="relative mb-8 overflow-hidden rounded-[7px] border border-slate-200/80 bg-slate-950 px-6 py-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:px-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.35),_transparent_35%)]" />
                <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-indigo-300">Tablero Todo</p>
                    <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Controla tus tareas y flujo de trabajo</h1>
                    <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
                      Bienvenido, {session.user?.email || 'usuario'}.
                    </p>
                  </div>
                  {/* Resumen de Tareas */}
                  <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
                    <div className="rounded-[7px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400 text-center">Total</p>
                      <p className="mt-2 text-2xl font-semibold text-white text-center">{todos.length}</p>
                    </div>
                    <div className="rounded-[7px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400 text-center">Pendientes</p>
                      <p className="mt-2 text-2xl font-semibold text-white text-center">{porAsignarTodos.length}</p>
                    </div>
                    <div className="rounded-[7px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400 text-center">Completas</p>
                      <p className="mt-2 text-2xl font-semibold text-white text-center">{completadasTodos.length}</p>
                    </div>
                  </div>
                </div>
              </header>
              {/* Inicio */}
              <main id="tareas" className="mt-8 grid gap-3 xl:grid-cols-[290px_1fr]">
                {/* Resumen Rapido */}
                <aside id="categorias" className="space-y-6 rounded-[7px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">

                  <div className="rounded-[7px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Próximas entregas</p>
                    <div className="mt-4 space-y-4">
                      {todos.slice(0, 3).map((todo) => (
                        <div key={todo.id} className="rounded-[7px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-medium text-slate-900">{todo.title}</p>
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          </div>
                          <p className="mt-2 text-xs text-slate-500">Entregar pronto</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>

                <section className="space-y-6">
                  <div className="flex flex-col gap-4 rounded-[7px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Tablero de tareas</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Flujo de trabajo actual</h2>
                    </div>
                    <button
                      onClick={() => setIsOpen(true)}
                      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      + Nueva tarea
                    </button>
                  </div>

                  <TodoFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    priorityFilter={priorityFilter}
                    setPriorityFilter={setPriorityFilter}
                  />

                  {filteredTodos.length === 0 && (
                    <div className="rounded-[7px] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
                      No se encontraron tareas con ese criterio de búsqueda.
                    </div>
                  )}

                  {/* Modal para crear nueva tarea */}
                  <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSave={handleCreateTodo}
                    categories={categories}
                    users={users}
                  />

                  {/* Modal único para editar tareas */}
                  <EditModal
                    open={Boolean(editingTodo)}
                    onClose={() => setEditingTodo(null)}
                    todo={editingTodo}
                    onSave={handleUpdateTodo}
                    categories={categories}
                    users={users}
                  />

                  <DndContext onDragEnd={handleDragEnd}>
                    <div className="grid gap-3 xl:grid-cols-3">
                      <Column
                        id="por_asignar"
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
                              onUpdate={handleUpdateTodo}
                              onOpenEdit={openEditModal}
                              categories={categories}
                              users={users}
                              actionLabel="Mover a progreso"
                              actionTarget="en_progreso"
                              className="bg-slate-950/80 text-white"
                            />
                          </div>
                        ))}
                      </Column>

                      <Column
                        id="en_progreso"
                        title="En progreso"
                        count={enProgresoTodos.length}
                        badgeText="Activo"
                        badgeClass="bg-sky-100 text-sky-700"
                        className="bg-white p-5 shadow-lg shadow-slate-900/5"
                        titleClass="text-slate-500"
                        countClass="text-slate-900"
                      >
                        {enProgresoTodos.map((todo) => (
                          <div key={todo.id} className="space-y-4">
                            <TodoCard
                              todo={todo}
                              onMove={moverTodo}
                              onUpdate={handleUpdateTodo}
                              onOpenEdit={openEditModal}
                              categories={categories}
                              users={users}
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
                        count={completadasTodos.length}
                        badgeText="Hecho"
                        badgeClass="bg-emerald-100 text-emerald-700"
                        className="bg-white p-5 shadow-lg shadow-slate-900/5"
                        titleClass="text-slate-500"
                        countClass="text-slate-900"
                      >
                        {completadasTodos.map((todo) => (
                          <div key={todo.id} className="space-y-4">
                            <TodoCard
                              todo={todo}
                              onMove={moverTodo}
                              onUpdate={handleUpdateTodo}
                              onOpenEdit={openEditModal}
                              categories={categories}
                              users={users}
                              actionLabel="Volver a pendiente"
                              actionTarget="por_asignar"
                              className="border border-slate-200 bg-slate-50 text-slate-900"
                            />
                          </div>
                        ))}
                      </Column>
                    </div>
                  </DndContext>
                </section>
              </main>
            </>
          )}
        </div>
      </div>
    </>
  );
}