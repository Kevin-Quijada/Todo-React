import { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { supabase } from './supabaseClient.js';
import Column from './components/Column.jsx';
import TodoCard from './components/TodoCard.jsx';
import EditModal from './components/EditModal.jsx';
import Header from './components/Header.jsx';
import UserAuthSection from './components/UserAuthSection.jsx';
import Modal from './components/Modal.jsx';
import { getTodos, getUsers, createTodo, updateTodo } from './services/TodoServices.js';
import { getCategories } from './services/TodoCategories.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

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
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(error.message);
      return;
    }
    setSession(null);
    setMessage('Has cerrado sesión.');
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


  const porAsignarTodos = todos.filter(
    todo => todo.status === 'por_asignar'
  );

  const enProgresoTodos = todos.filter(
    todo => todo.status === 'en_progreso'
  );

  const completadasTodos = todos.filter(
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

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div id="inicio" className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          {!session ? (
            <UserAuthSection authMode={authMode} setAuthMode={setAuthMode} />
          ) : (
            <>
              <header className="mb-8 rounded-3xl bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-slate-900/10 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Tablero Todo</p>
                  <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Controla tus tareas y flujo de trabajo</h1>
                  <p className="mt-3 max-w-2xl text-slate-300 sm:text-base">
                    Bienvenido, {session.user?.email || 'usuario'}.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center">
                  <div className="rounded-3xl bg-slate-900/70 px-5 py-4 text-left shadow-lg shadow-slate-950/10 sm:px-6">
                    <p className="text-sm text-slate-400">Tareas pendientes</p>
                    <p className="mt-2 text-3xl font-semibold">{porAsignarTodos.length}</p>
                  </div>
                </div>
              </header>

              <main id="tareas" className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <aside id="categorias" className="space-y-6 rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/5">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Resumen rápido</p>
                    <div className="rounded-3xl bg-slate-100 p-5">
                      <p className="text-sm text-slate-500">Hoy</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{todos.length} tareas</p>
                      <p className="mt-2 text-sm text-slate-600">Sigue el progreso diario y mantén el tablero limpio.</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Próximas entregas</p>
                    <div className="mt-4 space-y-4">
                      {todos.slice(0, 3).map((todo) => (
                        <div key={todo.id} className="rounded-3xl bg-white p-4 shadow-sm shadow-slate-200/50">
                          <p className="text-sm font-medium text-slate-900">{todo.title}</p>
                          <p className="mt-1 text-xs text-slate-500">Entregar pronto</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>

                <section className="space-y-6">
                  <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Tablero de tareas</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Flujo de trabajo actual</h2>
                    </div>
                    <button
                      onClick={() => setIsOpen(true)}
                      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      + Nueva tarea
                    </button>
                  </div>

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
                    <div className="grid gap-6 xl:grid-cols-3">
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
