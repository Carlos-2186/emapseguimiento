import type { Metadata } from 'next';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar sesión | SiDeriva',
};

const highlights = [
  'Seguimiento de cada etapa y responsable',
  'Alertas de plazos vencidos de 48 horas',
  'Bienes y servicios en un solo lugar',
];

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-surface">
      <section className="relative hidden w-1/2 overflow-hidden border-r border-emerald-200 bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-200 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="pointer-events-none absolute right-24 top-1/3 h-40 w-40 rounded-full bg-white/40 blur-2xl" />

        <div className="relative z-10 flex items-center gap-3 p-12">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white shadow-md shadow-emerald-300">
            S
          </div>
          <div>
            <p className="text-lg font-semibold text-emerald-900">SiDeriva</p>
            <p className="text-xs text-emerald-800/70">Seguimiento de bienes y servicios</p>
          </div>
        </div>

        <div className="relative z-10 px-14 pb-6">
          <h1 className="text-4xl font-bold leading-tight text-emerald-950">
            Centraliza las derivaciones
            <br />
            de tu organización en un solo lugar.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-emerald-900/70">
            Cada expediente avanza etapa por etapa, con responsable asignado y aviso
            automático cuando el plazo se vence.
          </p>
          <ul className="mt-10 space-y-4">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-emerald-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 p-12 text-xs text-emerald-900/60">
          © {new Date().getFullYear()} SiDeriva. Todos los derechos reservados.
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white">
                S
              </div>
              <div>
                <p className="text-lg font-semibold text-ink">SiDeriva</p>
                <p className="text-xs text-ink/50">Seguimiento de bienes y servicios</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-8 shadow-[0_8px_40px_rgba(5,150,105,0.10)] sm:p-10">
            <h2 className="text-2xl font-bold text-ink">Bienvenido de nuevo</h2>
            <p className="mt-2 text-sm text-ink/50">Ingresa tus credenciales para acceder al panel.</p>
            <div className="mt-8">
              <LoginForm />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-ink/50">
            ¿No tienes acceso? Contacta al administrador del sistema.
          </p>
        </div>
      </section>
    </main>
  );
}
