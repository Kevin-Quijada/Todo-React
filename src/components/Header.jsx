import React from 'react'
import Navbar from './Navbar'

const Header = ({ session, onSignOut, setAuthMode }) => { // session, onSignOut y setAuthMode son props que se pasan al componente Header
  return (
    <>
      <header className="bg-slate-900 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold">
                T
              </div>

              <div>
                <h1 className="text-xl font-bold">TodoApp</h1>
                <p className="text-xs text-slate-400">Organiza tus tareas</p>
              </div>
            </div>

            <Navbar />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {!session ? (
              <>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition"
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition"
                >
                  Registrarme
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="font-medium">{session.user.email}</p>
                  <p className="text-xs text-slate-400">Usuario activo</p>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header