import React, { useEffect, useState } from 'react';
import {
  getTodos,
  getUsers,
  updateTodo,
  deleteTodo,
} from '../services/TodoServices.js';
import {
  getCurrentSession,
  signOutUser,
  subscribeToAuth,
} from '../services/AuthServices.js';

import Header from '../components/Header.jsx';
import TodoFilters from '../components/TodoFilters.jsx';
import EditModal from '../components/EditModal.jsx';
import { filterTodos } from '../utils/todoFilters.js';

const Admin = () => {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);

  const [selectedTodo, setSelectedTodo] = useState(null);
  const [reassignUserId, setReassignUserId] = useState('');

  /* =========================================================
    Filtros de búsqueda y estado
  ========================================================= */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  /* =========================================================
     CARGAR TAREAS
  ========================================================= */

  async function loadTodos() {
    try {
      const data = await getTodos();
      setTodos(data || []);
    } catch (error) {
      console.error('Error cargando tareas:', error);
    }
  }

  /* =========================================================
     CARGAR USUARIOS
  ========================================================= */

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  }

  /* =========================================================
     AUTENTICACIÓN
  ========================================================= */

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
    if (!session) return;

    loadTodos();
    loadUsers();
  }, [session]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setSession(null);
      setTodos([]);
      setUsers([]);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  /* =========================================================
     BUSQUEDA Y FILTROS
  ========================================================= */

  const filteredTodos = filterTodos(todos, search, statusFilter, priorityFilter, '');

  const porAsignarTodos = filteredTodos.filter(
    todo => todo.status === 'por_asignar'
  ).length;

  const enProgresoTodos = filteredTodos.filter(
    todo => todo.status === 'en_progreso'
  ).length;

  const completadasTodos = filteredTodos.filter(
    todo => todo.status === 'completada'
  ).length;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header session={session} onSignOut={handleSignOut} setAuthMode={setAuthMode} />

      {!session ? (
        <div className="flex min-h-[60vh] items-center justify-center bg-slate-950 px-6 text-slate-300">
          <div className="rounded-[7px] border border-slate-800 bg-slate-900/80 px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-400">
              Verificando sesión
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Cargando permisos del administrador...
            </p>
          </div>
        </div>
      ) : (
        <>
        {/* Panel de administración */}
          <header className="relative overflow-hidden border-b border-white/10 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] sm:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.35),_transparent_35%)]" />

            <div className="relative z-10 mx-auto max-w-7xl">
              <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-400">
                    Administración
                  </p>

                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Panel de administración
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Gestiona las tareas, usuarios y asignaciones
                    desde un solo lugar.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-[7px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                    <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                      Tareas
                    </p>
                    <p className="mt-2 text-center text-2xl font-semibold text-white">
                      {todos.length}
                    </p>
                  </div>

                  <div className="rounded-[7px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                    <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                      Pendientes
                    </p>
                    <p className="mt-2 text-center text-2xl font-semibold text-white">
                      {porAsignarTodos + enProgresoTodos}
                    </p>
                  </div>

                  <div className="rounded-[7px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                    <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                      Completadas
                    </p>
                    <p className="mt-2 text-center text-2xl font-semibold text-white">
                      {completadasTodos}
                    </p>
                  </div>

                  <div className="rounded-[7px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                    <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                      Usuarios
                    </p>
                    <p className="mt-2 text-center text-2xl font-semibold text-white">
                      {users.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* Contenido principal */}
          <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
            <section className="mt-2">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                    Gestión
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Todas las tareas
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Administra y modifica las tareas de los usuarios.
                  </p>
                </div>

                <span className="w-fit rounded-[7px] border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-400">
                  {todos.length} tareas
                </span>
              </div>
            </section>

            <section className="mt-8">
              <div className="overflow-hidden rounded-[7px] border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/10">
                <div className="overflow-x-auto">
                  <TodoFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    priorityFilter={priorityFilter}
                    setPriorityFilter={setPriorityFilter}
                    className="rounded-none"
                  />
                  {/* Tabla de tareas */}
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="border-b border-slate-800 bg-white/[0.02]">
                      <tr className="text-xs uppercase tracking-[0.15em] text-slate-500">
                        <th className="px-5 py-4">Tarea</th>
                        <th className="px-5 py-4">Usuario</th>
                        <th className="px-5 py-4">Estado</th>
                        <th className="px-5 py-4">Prioridad</th>
                        <th className="px-5 py-4">Acciones</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800">
                      {filteredTodos.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center">
                            <p className="text-sm text-slate-500">No hay tareas disponibles.</p>
                          </td>
                        </tr>
                      )}

                      {filteredTodos.map((todo) => (
                        <tr key={todo.id} className="group transition hover:bg-white/[0.025]">
                          <td className="px-5 py-4 align-top">
                            <div className="max-w-xs">
                              <p className="font-medium text-white">{todo.title}</p>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                {todo.description || 'Sin descripción'}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <p className="font-medium text-slate-200">
                              {todo.assigned_user?.name || 'Sin asignar'}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {todo.assigned_user?.email || ''}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-300">
                              {todo.status ? todo.status.replace('_', ' ') : 'Sin estado'}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-300">
                              {todo.priority || 'Sin prioridad'}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTodo(todo);
                                  setEditOpen(true);
                                }}
                                className="rounded-[7px] border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/20"
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTodo(todo);
                                  setViewOpen(true);
                                }}
                                className="rounded-[7px] border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                              >
                                Ver
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTodo(todo);
                                  setReassignUserId(todo.assigned_user?.id || '');
                                  setReassignOpen(true);
                                }}
                                className="rounded-[7px] border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-500/20"
                              >
                                Reasignar
                              </button>

                              <button
                                type="button"
                                onClick={async () => {
                                  const ok = window.confirm('¿Seguro que deseas eliminar esta tarea?');
                                  if (!ok) return;

                                  try {
                                    await deleteTodo(todo.id);
                                    await loadTodos();
                                  } catch (error) {
                                    console.error('Error eliminando tarea:', error);
                                  }
                                }}
                                className="rounded-[7px] border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-500/20"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </main>

          <EditModal
            open={editOpen}
            onClose={() => {
              setEditOpen(false);
              setSelectedTodo(null);
            }}
            todo={selectedTodo}
            onSave={async (id, fields) => {
              const updated = await updateTodo(id, fields);
              if (updated) {
                await loadTodos();
              }
            }}
            users={users}
          />

          {viewOpen && selectedTodo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
              onClick={() => {
                setViewOpen(false);
                setSelectedTodo(null);
              }}
            >
              <div
                className="w-full max-w-2xl overflow-hidden rounded-[7px] border border-slate-200 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                        Detalles de tarea
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        {selectedTodo.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setViewOpen(false);
                        setSelectedTodo(null);
                      }}
                      className="rounded-[7px] border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="rounded-[7px] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Descripción
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {selectedTodo.description || 'Sin descripción'}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[7px] border border-slate-200 p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Asignado a</p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {selectedTodo.assigned_user?.name || 'Sin asignar'}
                      </p>
                    </div>

                    <div className="rounded-[7px] border border-slate-200 p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Estado</p>
                      <p className="mt-2 font-semibold capitalize text-slate-900">
                        {selectedTodo.status ? selectedTodo.status.replace('_', ' ') : 'Sin estado'}
                      </p>
                    </div>

                    <div className="rounded-[7px] border border-slate-200 p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Prioridad</p>
                      <p className="mt-2 font-semibold capitalize text-slate-900">
                        {selectedTodo.priority || 'Sin prioridad'}
                      </p>
                    </div>

                    <div className="rounded-[7px] border border-slate-200 p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Categoría</p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {selectedTodo.categories?.name || 'Sin categoría'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reassignOpen && selectedTodo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
              onClick={() => {
                setReassignOpen(false);
                setSelectedTodo(null);
              }}
            >
              <div
                className="w-full max-w-md overflow-hidden rounded-[7px] border border-slate-200 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b border-slate-200 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                    Administración
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">Reasignar tarea</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Selecciona el usuario que recibirá esta tarea.
                  </p>
                </div>

                <div className="p-6">
                  <div className="rounded-[7px] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                      Tarea seleccionada
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">{selectedTodo.title}</p>
                  </div>

                  <div className="mt-5">
                    <label className="text-sm font-semibold text-slate-700">Usuario</label>
                    <select
                      value={reassignUserId}
                      onChange={(e) => setReassignUserId(e.target.value)}
                      className="mt-2 w-full rounded-[7px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="">Sin asignar</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setReassignOpen(false);
                      setSelectedTodo(null);
                    }}
                    className="rounded-[7px] border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await updateTodo(selectedTodo.id, { user_id: reassignUserId || null });
                        await loadTodos();
                        setReassignOpen(false);
                        setSelectedTodo(null);
                      } catch (error) {
                        console.error('Error reasignando tarea:', error);
                      }
                    }}
                    className="rounded-[7px] bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;