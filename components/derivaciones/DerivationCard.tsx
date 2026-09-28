'use client';

import { fmtUSD, isOverdue, stageLabel, timeLabel } from './helpers';
import { WarningIcon } from './icons';
import type { Derivation } from './types';

export function DerivationCard({
  derivation,
  now,
  onClick,
}: {
  derivation: Derivation;
  now: number | null;
  onClick: () => void;
}) {
  const overdue = isOverdue(derivation, now);
  const deadline = timeLabel(derivation, now);

  const borderCls = overdue
    ? 'border-red-300 bg-red-50 hover:border-red-400'
    : 'border-line bg-white hover:border-emerald-200 hover:shadow-[0_4px_20px_rgba(5,150,105,0.10)]';

  const statusBadge =
    derivation.status === 'completed'
      ? 'bg-emerald-50 text-emerald-600'
      : derivation.status === 'rejected'
        ? 'bg-red-100 text-red-600'
        : overdue
          ? 'bg-red-100 text-red-600'
          : 'bg-emerald-50 text-emerald-600';

  const statusLabel =
    derivation.status === 'completed'
      ? 'Completado'
      : derivation.status === 'rejected'
        ? 'Rechazado'
        : overdue
          ? '⚠ Vencido'
          : 'En proceso';

  const dotCls = overdue
    ? 'bg-red-400'
    : derivation.status === 'completed'
      ? 'bg-emerald-400'
      : derivation.status === 'rejected'
        ? 'bg-red-400'
        : 'bg-emerald-400';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-5 transition-all group ${borderCls}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[10px] font-mono text-ink/35">{derivation.code}</p>
            {overdue && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                <WarningIcon className="w-3 h-3" />
                ALERTA
              </span>
            )}
          </div>
          <h3
            className={`text-sm font-semibold truncate transition-colors ${
              overdue ? 'text-red-700' : 'text-ink group-hover:text-emerald-700'
            }`}
          >
            {derivation.title}
          </h3>
          <p className="text-xs text-ink/50 mt-0.5">{derivation.requestedBy}</p>
        </div>
        <p className="text-base font-bold text-ink shrink-0">
          {fmtUSD(derivation.amount)}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
          <span className="text-xs text-ink/60">{stageLabel(derivation.currentStage)}</span>
        </div>
        <div className="flex items-center gap-2">
          {deadline && (
            <span className={`text-[10px] font-medium ${overdue ? 'text-red-500' : 'text-ink/50'}`}>
              {deadline}
            </span>
          )}
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${statusBadge}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </button>
  );
}
