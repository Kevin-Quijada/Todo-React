import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";

export default function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        // Obtener usuario autenticado
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setIsAdmin(false);
          return;
        }

        // Obtener el perfil del usuario
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error obteniendo perfil:", profileError);
          setIsAdmin(false);
          return;
        }

        // Comprobar si es administrador
        setIsAdmin(profile?.role === "admin");
      } catch (error) {
        console.error("Error comprobando permisos:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  // Mientras comprobamos el usuario
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Verificando permisos...
        </p>
      </div>
    );
  }

  // Si no es admin, lo mandamos a Inicio
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, puede acceder
  return children;
}