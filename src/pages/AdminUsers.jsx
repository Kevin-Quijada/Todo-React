import { useEffect, useState } from "react";
import UserTashkModal from "../components/UserTashkModal.jsx";
import { getUsers, updateUserRole, getTodosByUser } from "../services/TodoServices.js";
import { getCurrentSession, signOutUser, subscribeToAuth } from '../services/AuthServices.js';
import Header from '../components/Header.jsx';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [updatingUser, setUpdatingUser] = useState(null);
    const currentUserId = sessionStorage.getItem('currentUserId'); // Obtener el ID del usuario actual desde sessionStorage el sessionStorage es un almacenamiento web que permite guardar datos en el navegador del usuario de manera temporal, mientras que el localStorage guarda los datos de manera persistente incluso después de cerrar el navegador. En este caso, se utiliza sessionStorage para almacenar el ID del usuario actual durante la sesión activa.
    const [loading, setLoading] = useState(true);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserTodos, setSelectedUserTodos] = useState([]);
    const [session, setSession] = useState(null);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => {
        loadUsers();
        let isMounted = true;

        const initAuth = async () => { /* el initAuth es una función asíncrona que se utiliza para inicializar la autenticación */
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


    /* Cargar usuarios */
    async function loadUsers() {
        setLoading(true);

        const data = await getUsers();

        setUsers(data || []); /* || es el operador de coalescencia nula, que devuelve el valor de la izquierda si es diferente de null o undefined, de lo contrario devuelve el valor de la derecha en este caso [] tiene un valor por defecto */
        setLoading(false);
    }

    /* Manejar cambio de rol */
    async function handleRoleChange(userId, newRole) {
        setUpdatingUser(userId);

        const success = await updateUserRole(userId, newRole);

        if (success) {
            setUsers((currentUsers) => /* setUsers es una función que actualiza el estado de los usuarios */
                currentUsers.map((user) => /* currentUsers.map es una función que itera (iterar es repetir el proceso hasta que se cumpla una condición) sobre el array de usuarios */
                    user.id === userId /* en este caso la condición es que el id del usuario coincida con el userId que corresponde */
                        ? { ...user, role: newRole } /* es una forma de crear un nuevo objeto con las mismas propiedades que el objeto original, pero con el campo role actualizado */
                        : user /* en los demás casos, se devuelve el usuario sin cambios */
                )
            );
        }

        setUpdatingUser(null);
    } /* con esta funcion de manejo de roles hacemos que solo tengamos que hacer una peticion a la base de datos para modificar el rol sin antes volver a cargar la lista de usuarios */

    /* Manejar cierre de sesión */
    const handleSignOut = async () => {
        try {
            await signOutUser();
            setSession(null);
        } catch (error) {
            console.error('Error cerrando sesión:', error);
        }
    };

    /* cargar las tareas del usuario actual */
    async function handleViewTasks(user) {
        setSelectedUser(user);
        try {
            const todos = await getTodosByUser(user.id);
            setSelectedUserTodos(todos || []);
        } catch (error) {
            console.error("Error obteniendo tareas del usuario:", error);
            setSelectedUserTodos([]);
        }
        setViewOpen(true);
    }

    // 1. Filtramos todos los administradores una sola vez
    const admins = users.filter((user) => user.role === "admin");
    // 2. Si la lista tiene longitud 1, guardamos el ID del único admin. Si no, null.
    const lastAdminId = admins.length === 1 ? admins[0].id : null;



    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Header session={session} onSignOut={handleSignOut} setAuthMode={setAuthMode} />

            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Gestión de usuarios
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Administra los usuarios y sus roles dentro de la aplicación.
                    </p>
                </div>

                {/* Estadísticas */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                        <p className="text-sm text-slate-400">
                            Usuarios registrados
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {users.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                        <p className="text-sm text-slate-400">
                            Administradores
                        </p>

                        <p className="mt-2 text-3xl font-bold text-indigo-400">
                            {users.filter((user) => user.role === "admin").length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                        <p className="text-sm text-slate-400">
                            Usuarios normales
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {users.filter((user) => user.role === "user").length}
                        </p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">
                            Cargando usuarios...
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No hay usuarios registrados.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-slate-800 bg-slate-950">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                            Usuario
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                            Rol
                                        </th>

                                        <th className="px-6 py-4 text-right text-sm font-semibold">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-slate-800 last:border-b-0"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-medium">
                                                    {user.name || "Sin nombre"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-slate-400">
                                                {user.email}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${user.role === "admin"
                                                        ? "bg-indigo-500/10 text-indigo-400"
                                                        : "bg-slate-700 text-slate-300"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <select
                                                    value={user.role}
                                                    disabled={
                                                        updatingUser === user.id ||
                                                        user.id === currentUserId
                                                    }
                                                    onChange={(e) =>
                                                        handleRoleChange(user.id, e.target.value)
                                                    }
                                                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="user" disabled={lastAdminId === user.id}> {/* Esta opcion tambien se deberia de modificar en el backend para que no se pueda cambiar desde el html */}
                                                        Usuario
                                                    </option>
                                                    <option value="admin">
                                                        Administrador
                                                    </option>

                                                </select>
                                                <button
                                                    onClick={() => handleViewTasks(user)}
                                                    className="rounded-lg border border-slate-700 px-3 py-2 m-2 text-sm text-slate-300 transition hover:border-indigo-500 hover:text-indigo-400"
                                                >
                                                    Ver tareas
                                                </button>
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            </main>
            <UserTashkModal
                isOpen={viewOpen}
                onClose={() => setViewOpen(false)}
                user={selectedUser || { name: 'Usuario' }}
                todos={selectedUserTodos}
            />
        </div>
    );
}