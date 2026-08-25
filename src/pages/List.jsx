import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import UserAuthSection from '../components/UserAuthSection.jsx';
import Modal from '../components/Modal.jsx';
import EditModal from '../components/EditModal.jsx';
import { getCurrentSession, signOutUser, subscribeToAuth } from '../services/AuthServices.js';
import { getTodos, getUsers, createTodo, updateTodo, deleteTodo } from '../services/TodoServices.js';
import { getCategories } from '../services/TodoCategories.js';

function getStatusStyle(status) {
  switch (status) {
    case 'completada':
      return 'bg-emerald-500/20 text-emerald-300';
    case 'en_progreso':
      return 'bg-blue-600 text-blue-100';
    case 'por_asignar':
    default:
      return 'bg-slate-700 text-slate-200';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'completada':
      return 'Finalizado';
    case 'en_progreso':
      return 'En curso';
    case 'por_asignar':
    default:
      return 'Por asignar';
  }
}

const List = () => {
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

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

    async function loadData() {
      const [todoData, userData, categoryData] = await Promise.all([
        getTodos(),
        getUsers(),
        getCategories(),
      ]);

      setTasks(todoData || []);
      setUsers(userData || []);
      setCategories(categoryData?.data || []);
    }

    loadData();
  }, [session]);

  async function handleSignOut() {
    try {
      await signOutUser();
      setSession(null);
      setSelectedTaskId(null);
      setMessage('Has cerrado sesión.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCreateTodo(todo) {
    try {
      const newTodo = await createTodo(todo);

      if (!newTodo) return false;

      setTasks((prevTodos) => [newTodo, ...prevTodos]);
      return true;
    } catch (error) {
      console.error('Error creando tarea:', error);
      return false;
    }
  }

  async function handleUpdateTodo(id, updatedFields) {
    try {
      const updatedTodo = await updateTodo(id, updatedFields);
      if (!updatedTodo) return false;

      setTasks((prevTodos) => prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      return true;
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      return false;
    }
  }

  async function handleDeleteTodo(taskId) {
    const didDelete = await deleteTodo(taskId);

    if (didDelete) {
      setTasks((prevTodos) => prevTodos.filter((todo) => todo.id !== taskId));
      setSelectedTaskId(null);
    }
  }

  return (
    <>
      <Header session={session} onSignOut={handleSignOut} setAuthMode={setAuthMode} />

      {!session ? (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <UserAuthSection authMode={authMode} setAuthMode={setAuthMode} />  {/* esta función maneja la autenticación de usuarios */}
        </div>
      ) : (
        <>
          <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#111827] shadow-2xl shadow-slate-900/30">
                <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] items-center border-b border-slate-700 bg-slate-950 px-4 py-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
                  <div className="flex items-center gap-3 px-2">
                    <button
                      type="button"
                      aria-label="Seleccionar tarea"
                      className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] border border-slate-500 bg-transparent"
                    />
                    <span>Actividad</span>
                  </div>
                  <div className="px-2">Persona asignada</div>
                  <div className="px-2">Informador</div>
                  <div className="px-2">Prioridad</div>
                  <div className="px-2">Estado</div>
                </div>

                <div className="divide-y divide-slate-700">
                  {tasks.map((task) => {
                    const isSelected = selectedTaskId === task.id;
                    const assigneeName = task.assigned_user?.name || 'Sin asignar';
                    const reporterName = task.creator?.name || 'Sin asignar';
                    const initials = assigneeName
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase();

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`grid cursor-pointer grid-cols-[1.6fr_1fr_1fr_1fr_1fr] items-center gap-4 px-4 py-4 text-sm transition ${isSelected ? 'bg-slate-800/80' : 'hover:bg-slate-900/70'}`}
                      >
                        <div className="flex items-center gap-3 px-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTaskId(task.id);
                            }}
                            className={`inline-flex h-4 w-4 items-center justify-center rounded-[4px] border text-[10px] ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-500 bg-slate-900 text-slate-900'}`}
                            aria-label={`Seleccionar la tarea ${task.title}`}
                          >
                            {isSelected ? '✓' : ''}
                          </button>
                          <span className="text-slate-300">▸</span>
                          <span className="font-medium text-slate-100">{task.title}</span>
                        </div>

                        <div className="px-2">
                          <div className="flex items-center gap-2 text-slate-200">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-500 text-xs font-semibold text-white">
                              {initials || 'S'}
                            </span>
                            <span>{assigneeName}</span>
                          </div>
                        </div>

                        <div className="px-2 text-slate-200">{reporterName}</div>

                        <div className="px-2 text-slate-200">{task.priority || 'Ninguno'}</div>

                        <div className="px-2">
                          {isSelected ? (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTodo(task);
                                }}
                                className="rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-400"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTodo(task.id);
                                }}
                                className="rounded-md bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-400"
                              >
                                Eliminar
                              </button>
                            </div>
                          ) : (
                            <span className={`inline-flex min-w-[110px] items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${getStatusStyle(task.status)}`}>
                              {getStatusLabel(task.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-slate-700 bg-slate-950 px-4 py-4 text-slate-300">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-3 py-2 text-sm font-medium hover:bg-slate-800"
                  >
                    <span className="text-lg leading-none">＋</span>
                    Crear
                  </button>

                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-400">{tasks.length} de {tasks.length}</span>
                    <span className="text-slate-400">◌</span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Modal
            open={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSave={handleCreateTodo}
            categories={categories}
            users={users}
          />

          <EditModal
            open={Boolean(editingTodo)}
            onClose={() => {
              setEditingTodo(null);
              setSelectedTaskId(null);
            }}
            todo={editingTodo}
            onSave={handleUpdateTodo}
            categories={categories}
            users={users}
          />
        </>
      )}

      <footer />
    </>
  );
};

export default List;