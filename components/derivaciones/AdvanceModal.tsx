'use client';

import { useState } from 'react';
import { DESTINATARIOS, TAREAS } from './constants';
import { CheckIcon, ClipboardIcon } from './icons';
import type { Stage } from './types';

export type AdvancePayload = {
  destination: string;
  assignedTo: string;
  tasks: string[];
  comment?: string;
};

export function AdvanceModal({
  nextStage,
  personnel,
  onConfirm,
  onClose,
}: {
  nextStage: Stage;
  personnel: string[];
  onConfirm: (payload: AdvancePayload) => void;
  onClose: () => void;
}) {
  const [destination, setDestination] = useState('');
  const [assignedTo, setAssignedTo] = useState(personnel[0] ?? '');
  const [tasks, setTasks] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const toggleTask = (task: string) =>
    setTasks((prev) => (prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]));

  const confirm = () => {
    if (!destination) return;
    onConfirm({
      destination,
      assignedTo: assignedTo || personnel[0] || destination,
      tasks,
      comment: comment.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/30 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(5,150,105,0.15)] w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-line">
          <div>
            <h2 className="text-base font-bold text-ink">Derivar expediente</h2>
            <p className="text-xs text-ink/50 mt-0.5">
              Próxima etapa: {nextStage.label}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/35 hover:text-ink/60 transition text-lg leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {destination ? (
          <div className="mx-4 mt-3 flex items-center gap-3 bg-emerald-600 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">{destination.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-white/80 font-medium uppercase tracking-wide">
                Derivando a
              </p>
              <p className="text-white font-bold text-sm leading-tight truncate">{destination}</p>
            </div>
            <button
              type="button"
              onClick={() => setDestination('')}
              className="text-white/80 hover:text-white transition text-base leading-none shrink-0"
              aria-label="Quitar destinatario"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="mx-4 mt-3 flex items-center gap-3 border-2 border-dashed border-line rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center shrink-0">
              <ClipboardIcon className="w-4 h-4 text-ink/35" />
            </div>
            <p className="text-sm text-ink/35 font-medium">Ningún destinatario seleccionado</p>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden divide-x divide-line">
          <div className="flex flex-col flex-1 overflow-y-auto p-4">
            <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider mb-2">
              Nuevo Destinatario
            </p>
            <div className="space-y-0.5">
              {DESTINATARIOS.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setDestination(dest === destination ? '' : dest)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    destination === dest ? 'bg-emerald-600 text-white' : 'text-ink/70 hover:bg-surface'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                      destination === dest ? 'border-white bg-white' : 'border-line-strong'
                    }`}
                  >
                    {destination === dest && <span className="w-2 h-2 rounded-full bg-emerald-600 block" />}
                  </span>
                  {dest}
                </button>
              ))}
            </div>

            <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider mt-5 mb-2">
              Responsable en {nextStage.label}
            </p>
            <div className="space-y-0.5 pb-1">
              {personnel.map((person) => (
                <button
                  key={person}
                  type="button"
                  onClick={() => setAssignedTo(person)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    assignedTo === person ? 'bg-emerald-50 text-emerald-600' : 'text-ink/70 hover:bg-surface'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                      assignedTo === person ? 'border-emerald-600' : 'border-line-strong'
                    }`}
                  >
                    {assignedTo === person && <span className="w-2 h-2 rounded-full bg-emerald-600 block" />}
                  </span>
                  {person}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col w-48 overflow-y-auto p-4">
            <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider mb-2">Tareas</p>
            <div className="space-y-0.5">
              {TAREAS.map((task) => (
                <button
                  key={task}
                  type="button"
                  onClick={() => toggleTask(task)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                    tasks.includes(task) ? 'bg-emerald-50 text-emerald-600' : 'text-ink/70 hover:bg-surface'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                      tasks.includes(task) ? 'bg-emerald-600 border-emerald-600' : 'border-line-strong'
                    }`}
                  >
                    {tasks.includes(task) && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                  </span>
                  <span className="text-left leading-tight">{task}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pt-3 pb-1 border-t border-line">
          <label
            htmlFor="derivacion-comentario"
            className="text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1.5"
          >
            Comentario
          </label>
          <textarea
            id="derivacion-comentario"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Observaciones o instrucciones adicionales…"
            rows={3}
            className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none placeholder:text-ink/35"
          />
        </div>

        <div className="px-6 pb-5 pt-2">
          <button
            type="button"
            onClick={confirm}
            disabled={!destination}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold py-3 rounded-full text-sm transition shadow-md shadow-emerald-200"
          >
            {destination ? `Derivar a ${destination}` : 'Selecciona un destinatario'}
          </button>
        </div>
      </div>
    </div>
  );
}
