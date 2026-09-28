'use client';

import { LogoutButton } from '../LogoutButton';
import { WarningIcon } from './icons';

function initials(nombre: string) {
  return nombre
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Header({
  nombre,
  rol,
  overdueCount,
}: {
  nombre: string;
  rol: string;
  overdueCount: number;
}) {
  return (
    <nav className="bg-white border-b border-line px-5 py-3.5 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <span className="font-bold text-sm text-ink">SiDeriva</span>
        {overdueCount > 0 && (
          <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            <WarningIcon className="w-3 h-3" />
            {overdueCount} vencida{overdueCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
            {initials(nombre)}
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-ink">{nombre}</p>
            <p className="text-[10px] text-ink/50 capitalize">{rol}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
}
