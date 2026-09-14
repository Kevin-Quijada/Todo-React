import React from 'react'


const UserTashkModal = ({
    isOpen = false,
    onClose = () => {},
    user = { name: 'Usuario ejemplo' },
    todos = [],

}) => {
    if (!isOpen) return null

    const visibleTodos = todos.length > 0 ? todos : exampleTodos

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <div className="relative mx-4 max-w-4xl rounded-lg bg-slate-900 p-6 text-white">
                <header className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Gestión</p>
                        <h3 className="mt-1 text-lg font-semibold">Tareas de {user.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">Listado de tareas asignadas al usuario seleccionado.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="rounded-[7px] border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">{visibleTodos.length} tareas</span>
                        <button onClick={onClose} className="rounded px-3 py-1 text-sm font-medium text-slate-300 hover:bg-white/5">Cerrar</button>
                    </div>
                </header>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-800 text-xs uppercase tracking-[0.12em] text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Tarea</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Prioridad</th>
                                <th className="px-4 py-3">Fecha de creación</th>
                                <th className="px-4 py-3">Fecha de actualización</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800">
                            {visibleTodos.map((todo) => (
                                <tr key={todo.id} className="group hover:bg-white/[0.02]">
                                    <td className="px-4 py-3 align-top">
                                        <div>
                                            <p className="font-medium text-white">{todo.title}</p>
                                            <p className="mt-1 text-xs text-slate-400">{todo.description || 'Sin descripción'}</p>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 align-top">
                                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-300">
                                            {todo.status ? todo.status.replace('_', ' ') : 'Sin estado'}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 align-top">
                                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-300">
                                            {todo.priority || 'Sin prioridad'}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 align-top">
                                        <div className="flex flex-wrap gap-2">
                                            {todo.created_at ? (
                                                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                                                    {new Date(todo.created_at).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                                                    Sin fecha
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top ">
                                        <div className="flex flex-wrap gap-2 ">
                                            {todo.updated_at ? (
                                                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 ">
                                                    {new Date(todo.updated_at).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                                                    Sin fecha
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UserTashkModal