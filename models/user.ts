import { pool } from '@/config/database';
import type { OkPacket, RowDataPacket } from 'mysql2';

export interface User {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
  rol: string;
  creado_en: Date;
}

export type PublicUser = Omit<User, 'password_hash'>;

export async function findByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, nombre, email, password_hash, rol, creado_en FROM usuarios WHERE email = ? LIMIT 1',
    [email]
  );
  return (rows[0] as User | undefined) ?? null;
}

export async function findById(id: number): Promise<PublicUser | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ? LIMIT 1',
    [id]
  );
  return (rows[0] as PublicUser | undefined) ?? null;
}

export async function createUser(data: {
  nombre: string;
  email: string;
  password_hash: string;
  rol?: string;
}): Promise<PublicUser> {
  const [result] = await pool.query<OkPacket>(
    'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
    [data.nombre, data.email, data.password_hash, data.rol ?? 'usuario']
  );
  const user = await findById(result.insertId);
  if (!user) throw new Error('No se pudo crear el usuario');
  return user;
}
