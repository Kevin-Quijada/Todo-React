import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    async function getUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setUser(null);
          setRole(null);
          return;
        }

        setUser(user);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error obteniendo rol:", error);
          setRole(null);
          return;
        }

        setRole(profile?.role ?? "user");
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    }

    getUserData();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getUserData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error cerrando sesión:", error);
      return;
    }

    navigate("/");
  }



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

        {/* Solo administrador */}
        {role === "admin" && (
          <Link
            to="/admin"
            className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            Administración
          </Link>
        )}
      </nav>
    </>
  )
}

export default Navbar