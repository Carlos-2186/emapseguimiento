import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { DerivacionesApp } from '@/components/derivaciones/DerivacionesApp';
import { getSession } from '@/controllers/authController';

export const metadata: Metadata = {
  title: 'Derivaciones | SiDeriva',
};

export default async function DerivacionesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return <DerivacionesApp nombre={session.nombre} rol={session.rol} />;
}
