import type { NextRequest } from 'next/server';
import { login } from '@/controllers/authController';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    const result = await login(body.email, body.password);

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: result.status });
    }
    return Response.json({ user: result.data.user });
  } catch {
    return Response.json({ error: 'Cuerpo de petición inválido' }, { status: 400 });
  }
}