import React from 'react'
import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
    <>
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/" className="hover:text-emerald-400 transition">
          Inicio
        </Link>
        <Link to="/list" className="hover:text-emerald-400 transition">
          Listado
        </Link>
        <Link to="/dashboard" className="hover:text-emerald-400 transition">
          Dashboard
        </Link>

          <Link to="/admin">
            Administración
          </Link>
      </nav>
    </>
  )
}

export default Navbar