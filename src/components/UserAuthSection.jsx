import { useState } from 'react';
import {
  signInWithPassword,
  signUpWithPassword,
} from '../services/AuthServices.js';

export default function UserAuthSection({ authMode, setAuthMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (!email || !password || (authMode === 'register' && !name)) {
      setMessage('Por favor completa todos los campos.');
      return;
    }

    try {
      if (authMode === 'register') {
        await signUpWithPassword({
          name,
          email,
          password,
        });

        setMessage('Registro enviado. Revisa tu email o inicia sesión.');
        setAuthMode('login');
        setName('');
        setPassword('');
        return;
      }

      await signInWithPassword({
        email,
        password,
      });

      setMessage('Has iniciado sesión correctamente.');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section id="auth" className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-lg shadow-slate-900/5">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Usuario</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">{authMode === 'register' ? 'Regístrate' : 'Inicia sesión'}</h1>
        <p className="mt-3 text-slate-600">
          {authMode === 'register'
            ? 'Crea una cuenta para guardar tus tareas y usar la app.'
            : 'Accede con tu correo y contraseña.'}
        </p>
      </div>

      <form onSubmit={handleAuthSubmit} className="space-y-5">
        {authMode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-slate-700">Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-emerald-500 focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-emerald-500 focus:outline-none"
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-emerald-500 focus:outline-none"
            placeholder="Min. 6 caracteres"
          />
        </div>

        {message && <p className="text-sm text-emerald-700">{message}</p>}

        <button
          type="submit"
          className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {authMode === 'register' ? 'Registrarme' : 'Iniciar sesión'}
        </button>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>{authMode === 'register' ? 'Ya tienes cuenta?' : '¿No tienes cuenta?'}</p>
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'register' ? 'login' : 'register');
              setMessage('');
            }}
            className="font-semibold text-emerald-600 hover:text-emerald-800"
          >
            {authMode === 'register' ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </div>
      </form>
    </section>
  );
}
