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
    .select("id, name, email, role") // Selecciona los campos id, name y email de la tabla profiles la cual solo contiene los usuarios registrados no es nesesario llamar a la tabla users ya que esta contiene informacion de autenticacion y no es necesario mostrarla
    .order("name");

  if (error) {
    console.error("Error obteniendo usuarios:", error);
    return;
  }

  return data;
}

/* Funcion para actualizar el rol */
export async function updateUserRole(userId, newRole) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role: newRole }) /* el role: newRole significa que se actualiza el campo role con el nuevo valor, es mejor que se utilice el newRole para evitar confusiones */
    .eq("id", userId);

  if (error) {
    console.error("Error actualizando rol del usuario:", error);
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
    `) /* assigned_user:profiles!todos_user_id_fkey(id, name) tareas asignadas al usuario en la tabla externa profiles (!) indica una relación forzada o especifica con la tabla profiles */
    .single(); /* en resumen es una linea de codigo que solo extraera el id y el name del usuario asignado */

  if (error) {
    console.error("Error al crear la tarea:", error);
    return null;
  }

  return data;
}

/* Editar una tarea */

export async function updateTodo(id, todo) {
  const { data, error } = await supabase
    .from("todos")
    .update(todo)
    .eq("id", id)
    .select(`
      *,
      categories(id, name, color),
      assigned_user:profiles!todos_user_id_fkey(id, name)
    `)
    .single();

  if (error) {
    console.error("Error al actualizar la tarea:", error);
    return null;
  }

  return data;
}

export async function deleteTodo(id) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar la tarea:', error);
    return false;
  }

  return true;
}

/* Obtener una tarea por su usuario id */
export async function getTodosByUser(userId) {
  const { data, error } = await supabase
    .from("todos")
    .select(`
      *,
      categories(id, name, color),
      assigned_user:profiles!todos_user_id_fkey(id, name),
      creator:profiles!todos_created_by_fkey(id, name)  
    `) /* creator:profiles es una relación con la tabla profiles para obtener la información del creador de la tarea */
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error obteniendo tareas del usuario:", error);
    return [];
  }

  return data;
}