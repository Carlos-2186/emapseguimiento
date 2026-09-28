import { redirect } from 'next/navigation';
import { getSession } from '@/controllers/authController';

export default async function Home() {
  const session = await getSession();
  redirect(session ? '/derivaciones' : '/login');
}
