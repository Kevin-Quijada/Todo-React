import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getUsers } from "../services/TodoServices.js";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadUsers() {
        setLoading(true);

        const data = await getUsers();

        setUsers(data || []);
        setLoading(false);
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

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
                                                <button
                                                    disabled
                                                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-500"
                                                >
                                                    Editar
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
        </div>
    );
}