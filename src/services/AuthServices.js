import { supabase } from '../supabaseClient.js';

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

export function subscribeToAuth(callback) { /* subscribeToAuth es la función que permite suscribirse a los cambios en el estado de autenticación es decir, se ejecuta cada vez que el estado de autenticación cambia */
  const { 
    data: {subscription}
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => {
    subscription.unsubscribe();
  };
}

export async function signInWithPassword({ email, password }) { /* signin es inicio de session */  /* signInWithPassword es la función que permite iniciar sesión con un correo y contraseña */
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUpWithPassword({ name, email, password }) { /* signup es registro de session */  /* signUpWithPassword es la función que permite registrarse con un nombre, correo y contraseña */
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    throw error;
  }

  const user = data.user;

  /* Guardar perfil del usuario */
  if (user?.id) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          name,
          email,
        },
        { onConflict: 'id' }
      );

    if (profileError) {
      console.error('Error saving user profile:', profileError);
    }
  }

  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
