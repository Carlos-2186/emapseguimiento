import type { NextRequest } from 'next/server';
import { register } from '@/controllers/authController';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      nombre?: unknown;
      email?: unknown;
      password?: unknown;
    };
    const result = await register(body.nombre, body.email, body.password);

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: result.status });
    }
    return Response.json({ user: result.data.user }, { status: 201 });
  } catch {
    return Response.json({ error: 'Cuerpo de petición inválido' }, { status: 400 });
  }
}