import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { createUser, findByEmail, type PublicUser } from '@/models/user';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionPayload,
} from '@/lib/session';

export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function startSession(user: PublicUser): Promise<void> {
  const token = await signSession({
    sub: String(user.id),
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function login(
  email: unknown,
  password: unknown
): Promise<AuthResult<{ user: PublicUser }>> {
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return { ok: false, error: 'Email y contraseña son obligatorios', status: 400 };
  }

  const user = await findByEmail(email.trim().toLowerCase());
  const valid = user && (await bcrypt.compare(password, user.password_hash));
  if (!valid) {
    return { ok: false, error: 'Credenciales inválidas', status: 401 };
  }

  const safe: PublicUser = {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    creado_en: user.creado_en,
  };
  await startSession(safe);
  return { ok: true, data: { user: safe } };
}

export async function register(
  nombre: unknown,
  email: unknown,
  password: unknown
): Promise<AuthResult<{ user: PublicUser }>> {
  if (typeof nombre !== 'string' || nombre.trim().length < 2) {
    return { ok: false, error: 'El nombre debe tener al menos 2 caracteres', status: 400 };
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'Ingresa un email válido', status: 400 };
  }
  if (typeof password !== 'string' || password.length < 6) {
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres', status: 400 };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findByEmail(normalizedEmail);
  if (existing) {
    return { ok: false, error: 'El email ya está registrado', status: 409 };
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = await createUser({
    nombre: nombre.trim(),
    email: normalizedEmail,
    password_hash,
  });

  await startSession(user);
  return { ok: true, data: { user } };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
