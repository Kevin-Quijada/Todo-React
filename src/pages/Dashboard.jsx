import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import { getCurrentSession, signOutUser, subscribeToAuth } from '../services/AuthServices.js';
import { getTodos } from '../services/TodoServices.js';

const priorityStyles = {
  alta: 'bg-rose-500/10 text-rose-300 border border-rose-500/20',
  media: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  baja: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
};

const EMPTY_PRIORITY = {
  alta: 0,
  media: 0,
  baja: 0,
};

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [authMode, setAuthMode] = useState('login');

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

    const loadTasks = async () => {
      const userTasks = await getTodos();
      setTasks(userTasks || []);
    };

    loadTasks();
  }, [session]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const pendientes = tasks.filter((task) => task.status === 'por_asignar').length;
    const progreso = tasks.filter((task) => task.status === 'en_progreso').length;
    const completadas = tasks.filter((task) => task.status === 'completada').length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const tareasEsteMes = tasks.filter((task) => {
      if (!task.created_at) return false;
      const date = new Date(task.created_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const completadasEsteMes = tareasEsteMes.filter((task) => task.status === 'completada').length;
    const porcentajeMes = tareasEsteMes.length ? Math.round((completadasEsteMes / tareasEsteMes.length) * 100) : 0;

    const prioridades = tasks.reduce((acc, task) => {
      const priority = String(task.priority || '').toLowerCase();
      if (priority === 'alta' || priority === 'media' || priority === 'baja') {
        acc[priority] += 1;
      }
      return acc;
    }, { ...EMPTY_PRIORITY });

    return {
      total,
      pendientes,
      progreso,
      completadas,
      porcentajeMes,
      prioridades,
      tareasEsteMes,
    };
  }, [tasks]);

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 5),
    [tasks]
  );

  const usuarioNombre = session?.user?.user_metadata?.full_name || session?.user?.email || 'Usuario';

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setSession(null);
      setTasks([]);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  return (
    <>
      <Header session={session} onSignOut={handleSignOut} setAuthMode={setAuthMode} />

      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {!session ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-300">
              Inicia sesión para ver tus estadísticas.
            </div>
          ) : (
            <>
              <section className="rounded-3xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-900/40 p-6 shadow-xl shadow-slate-950/20">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Dashboard</p>
                    <h1 className="mt-3 text-3xl font-bold text-white">Bienvenido, {usuarioNombre}</h1>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Total</p>
                    <p className="mt-1 text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Tareas en total', value: stats.total, accent: 'bg-sky-500/10 text-sky-300' },
                  { label: 'Pendientes', value: stats.pendientes, accent: 'bg-amber-500/10 text-amber-300' },
                  { label: 'En progreso', value: stats.progreso, accent: 'bg-violet-500/10 text-violet-300' },
                  { label: 'Completadas', value: stats.completadas, accent: 'bg-emerald-500/10 text-emerald-300' },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
                    <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.accent}`}>
                      {card.label}
                    </div>
                    <p className="mt-5 text-3xl font-bold text-white">{card.value}</p>
                  </div>
                ))}
              </section>

              <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Progreso del mes</h2>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                      {stats.porcentajeMes}%
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                      <span>Tareas completadas</span>
                      <span>
                        {stats.completadasEsteMes || 0} / {stats.tareasEsteMes.length || 0}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{ width: `${stats.porcentajeMes}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                  <h2 className="text-xl font-semibold text-white">Prioridades</h2>
                  <div className="mt-5 space-y-4">
                    {Object.entries({ alta: 'Alta', media: 'Media', baja: 'Baja' }).map(([key, label]) => {
                      const count = stats.prioridades[key];
                      const percentage = stats.total ? Math.round((count / stats.total) * 100) : 0;

                      return (
                        <div key={key}>
                          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                            <span className={`rounded-full px-2 py-1 ${priorityStyles[key]}`}>{label}</span>
                            <span>{count}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                            <div
                              className={`h-full rounded-full ${key === 'alta' ? 'bg-rose-400' : key === 'media' ? 'bg-amber-400' : 'bg-emerald-400'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold text-white">Tareas recientes</h2>
                <div className="mt-5 space-y-3">
                  {recentTasks.length > 0 ? (
                    recentTasks.map((task, index) => (
                      <div
                        key={task.id ?? `${task.title}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-white">{task.title}</p>
                          <p className="text-sm text-slate-400">
                            {task.status === 'completada' ? 'Completada' : task.status === 'en_progreso' ? 'En progreso' : 'Pendiente'}
                          </p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${priorityStyles[String(task.priority || '').toLowerCase()] || 'bg-slate-700 text-slate-200'}`}>
                          {String(task.priority || 'Sin prioridad').charAt(0).toUpperCase() + String(task.priority || 'Sin prioridad').slice(1)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">Aún no tienes tareas recientes.</p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;