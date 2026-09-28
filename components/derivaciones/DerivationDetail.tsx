'use client';

import { useState } from 'react';
import { AdvanceModal, type AdvancePayload } from './AdvanceModal';
import { STAGES } from './constants';
import { fmtUSD, isOverdue, personnelFor, stageLabel, timeLabel } from './helpers';
import { CheckIcon, ChevronLeftIcon, PinIcon, WarningIcon } from './icons';
import type { Derivation } from './types';

export function DerivationDetail({
  derivation,
  now,
  onBack,
  onAdvance,
  onFinalize,
}: {
  derivation: Derivation;
  now: number | null;
  onBack: () => void;
  onAdvance: (payload: AdvancePayload) => void;
  onFinalize: () => void;
}) {
  const [showAdvance, setShowAdvance] = useState(false);

  const overdue = isOverdue(derivation, now);
  const deadline = timeLabel(derivation, now);
  const nextStageIndex = derivation.currentStage + 1;
  const canAdvance = derivation.status === 'active' && nextStageIndex < STAGES.length;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium mb-6 hover:opacity-70 transition"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        Volver
      </button>

      {overdue && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3">
          <WarningIcon className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700">Plazo vencido</p>
            <p className="text-xs text-red-400">
              {deadline} · Esta derivación supera las 48 horas en la etapa actual.
            </p>
          </div>
        </div>
      )}

      <div
        className={`rounded-2xl border p-6 mb-4 ${
          overdue ? 'bg-red-50 border-red-200' : 'bg-white border-line'
        }`}
      >
        <p className="text-[10px] font-mono text-ink/35 mb-1">{derivation.code}</p>
        <h1 className="text-lg font-bold text-ink">{derivation.title}</h1>
        <p className="text-sm text-ink/50 mt-0.5">
          {derivation.requestedBy} · {derivation.type === 'bien' ? 'Bien' : 'Servicio'}
        </p>
        <p className="text-2xl font-bold text-ink mt-3">{fmtUSD(derivation.amount)}</p>
        {deadline && (
          <p className={`text-xs mt-2 font-medium ${overdue ? 'text-red-500' : 'text-ink/50'}`}>
            {deadline}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-line p-6 mb-4">
        <p className="text-xs font-semibold text-ink/50 mb-4 uppercase tracking-wide">
          ¿Dónde está?
        </p>

        <div
          className={`rounded-xl p-4 mb-5 flex items-center gap-3 ${
            overdue ? 'bg-red-50' : 'bg-emerald-50'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md ${
              overdue ? 'bg-red-500 shadow-red-200' : 'bg-emerald-600 shadow-emerald-200'
            }`}
          >
            <PinIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p
              className={`text-[10px] font-medium uppercase tracking-wide ${
                overdue ? 'text-red-400' : 'text-emerald-600'
              }`}
            >
              Ubicación actual
            </p>
            <p className={`text-base font-bold ${overdue ? 'text-red-700' : 'text-emerald-600'}`}>
              {stageLabel(derivation.currentStage)}
            </p>
            <p className="text-xs text-ink/50 mt-0.5">
              Responsable: <span className="font-semibold text-ink">{derivation.assignedTo}</span>
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-3.5 left-3.5 w-px bottom-0 bg-surface" />
          <div className="space-y-3">
            {STAGES.map((stage, i) => {
              const done = i < derivation.currentStage;
              const active = i === derivation.currentStage;
              const entry = derivation.history.find((h) => h.stage === i);

              return (
                <div
                  key={`${stage.id}-${i}`}
                  className={`relative flex items-start gap-3 pl-8 ${i > derivation.currentStage ? 'opacity-30' : ''}`}
                >
                  <div
                    className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                      active && overdue
                        ? 'bg-red-500 text-white ring-4 ring-red-100'
                        : active
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          :                           done
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-surface text-ink/35 border border-line'
                    }`}
                  >
                    {done ? <CheckIcon className="w-3 h-3" /> : i + 1}
                  </div>

                  <div className="flex-1 py-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-sm ${
                          active && overdue
                            ? 'font-semibold text-red-600'
                            : active
                              ? 'font-semibold text-emerald-600'
                              : done
                                ? 'text-ink/60'
                                : 'text-ink/35'
                        }`}
                      >
                        {stage.label}
                      </span>
                      {entry && <span className="text-[10px] text-ink/35 shrink-0">{entry.date}</span>}
                    </div>

                    {entry && (
                      <div className="text-[10px] text-ink/50 mt-0.5 space-y-0.5">
                        <p>
                          {entry.assignedTo}
                          {entry.destination ? ` · ${entry.destination}` : ''}
                        </p>
                        {entry.comment && <p className="italic">“{entry.comment}”</p>}
                        {entry.tasks && entry.tasks.length > 0 && (
                          <p className="flex flex-wrap gap-1 pt-0.5">
                            {entry.tasks.map((task) => (
                              <span
                                key={task}
                                className="bg-surface text-ink/60 rounded px-1.5 py-0.5"
                              >
                                {task}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {canAdvance && (
          <div className="flex gap-2 mt-5">
            <button
              type="button"
              onClick={() => setShowAdvance(true)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-full text-sm transition shadow-md shadow-emerald-200"
            >
              Derivar →
            </button>
            <button
              type="button"
              onClick={onFinalize}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-full text-sm transition shadow-md shadow-emerald-200"
            >
              Finalizar
            </button>
          </div>
        )}

        {derivation.status === 'completed' && (
          <p className="text-center text-sm text-emerald-600 font-semibold mt-4">
            ✓ Proceso completado
          </p>
        )}
        {derivation.status === 'rejected' && (
          <p className="text-center text-sm text-red-500 font-semibold mt-4">✗ Derivación rechazada</p>
        )}
      </div>

      {showAdvance && canAdvance && (
        <AdvanceModal
          nextStage={STAGES[nextStageIndex]}
          personnel={personnelFor(nextStageIndex)}
          onClose={() => setShowAdvance(false)}
          onConfirm={(payload) => {
            setShowAdvance(false);
            onAdvance(payload);
          }}
        />
      )}
    </div>
  );
}
