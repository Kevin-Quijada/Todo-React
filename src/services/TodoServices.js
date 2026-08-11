import { supabase } from '../supabaseClient.js';

/* Funciones para manejar las tareas */
export async function getTodos() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // Obtener el perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  let query = supabase
    .from("todos")
    .select(`
        *,
        categories(id, name, color),
        assigned_user:profiles!todos_user_id_fkey(id, name),
        creator:profiles!todos_created_by_fkey(id, name)
      `);

  // Solo filtrar si NO es administrador
  if (profile.role !== "admin") {
    query = query.eq("user_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error obteniendo tareas:", error);
    return;
  }
  return data;
}

/* Función para obtener la lista de usuarios */
export async function getUsers() { // Función para obtener la lista de usuarios
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email") // Selecciona los campos id, name y email de la tabla profiles la cual solo contiene los usuarios registrados no es nesesario llamar a la tabla users ya que esta contiene informacion de autenticacion y no es necesario mostrarla
    .order("name");

  if (error) {
    console.error("Error obteniendo usuarios:", error);
    return;
  }

  return data;
}


/* Funcion para crear una nueva tarea */
export async function createTodo(todo) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("todos")
    .insert({
      ...todo,
      created_by: user.id,
    })
    .select(`
      *,
      categories(id, name, color),
      assigned_user:profiles!todos_user_id_fkey(id, name)
    `)
    .single();

  if (error) {
    console.error("Error al crear la tarea:", error);
    return null;
  }

  return data;
}

/* Eliminar una tarea */
