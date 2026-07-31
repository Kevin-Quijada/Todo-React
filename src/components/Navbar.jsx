import React from 'react'

const Navbar = () => {
  return (
    <>
      <nav className="hidden md:flex items-center gap-8">
        <a href="/" className="hover:text-emerald-400 transition">
          Inicio
        </a>

        <a href="/tareas" className="hover:text-emerald-400 transition">
          Mis tareas
        </a>

        <a href="/categorias" className="hover:text-emerald-400 transition">
          Categorías
        </a>
      </nav>
    </>
  )
}

export default Navbar