import { logout } from '@/controllers/authController';

export async function POST() {
  await logout();
  return Response.json({ ok: true });
}