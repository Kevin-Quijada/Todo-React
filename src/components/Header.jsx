import React from 'react'
import Navbar from './Navbar'

const Header = () => {
  return (
    <>
      <header className="bg-slate-900 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold">
              T
            </div>

            <div>
              <h1 className="text-xl font-bold">TodoApp</h1>
              <p className="text-xs text-slate-400">Organiza tus tareas</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="hover:text-emerald-400 transition">
              Inicio
            </a>

            <a href="#" className="hover:text-emerald-400 transition">
              Mis tareas
            </a>

            <a href="#" className="hover:text-emerald-400 transition">
              Categorías
            </a>
          </nav>

          {/* Usuario */}
          <div className="flex items-center gap-4">

            {/* Mostrar si NO hay sesión */}
            <button className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold hover:bg-emerald-600 transition">
              Iniciar sesión
            </button>

            {/* Mostrar cuando el usuario esté autenticado */}
            {/* 
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100"
                alt="Usuario"
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="hidden sm:block">
                <p className="font-medium">Juan Pérez</p>
                <p className="text-xs text-slate-400">
                  juan@email.com
                </p>
              </div>
            </div>
            */}

          </div>

        </div>
      </header>
    </>
  )
}

export default Header