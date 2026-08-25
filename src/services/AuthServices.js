import { supabase } from '../supabaseClient.js';

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export function subscribeToAuth(onSessionChange) {
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    onSessionChange(session);
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}

export async function signInWithPassword({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUpWithPassword({ name, email, password }) {
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
