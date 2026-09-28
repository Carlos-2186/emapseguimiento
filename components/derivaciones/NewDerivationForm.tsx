'use client';

import { useState } from 'react';
import { CheckIcon } from './icons';
import type { Derivation } from './types';

export function NewDerivationForm({
  personnel,
  onClose,
  onCreate,
}: {
  personnel: string[];
  onClose: () => void;
  onCreate: (draft: Pick<Derivation, 'title' | 'type' | 'requestedBy' | 'amount' | 'assignedTo'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Derivation['type']>('bien');
  const [requestedBy, setRequestedBy] = useState('');
  const [amount, setAmount] = useState('');
  const [assignedTo, setAssignedTo] = useState(personnel[0] ?? '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ title: title.trim(), type, requestedBy: requestedBy.trim(), amount: Number(amount) || 0, assignedTo });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/30 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(5,150,105,0.15)] w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-ink">Nueva derivación</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/35 hover:text-ink/60 transition text-lg leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="nuevo-titulo" className="text-xs font-medium text-ink/50 block mb-1.5">
              ¿Qué se necesita?
            </label>
            <input
              id="nuevo-titulo"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Equipos de cómputo"
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <span className="text-xs font-medium text-ink/50 block mb-1.5">Tipo</span>
            <div className="grid grid-cols-2 gap-2">
              {(['bien', 'servicio'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setType(option)}
                  className={`py-2 rounded-full text-sm font-medium border transition ${
                    type === option
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-line text-ink/50 hover:bg-surface'
                  }`}
                >
                  {option === 'bien' ? 'Bien' : 'Servicio'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="nuevo-solicitante"
              className="text-xs font-medium text-ink/50 block mb-1.5"
            >
              Solicitado por
            </label>
            <input
              id="nuevo-solicitante"
              required
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              placeholder="Nombre completo"
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <label htmlFor="nuevo-monto" className="text-xs font-medium text-ink/50 block mb-1.5">
              Monto estimado (USD)
            </label>
            <input
              id="nuevo-monto"
              required
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <span className="text-xs font-medium text-ink/50 block mb-1.5">Asignar a (Gerencia)</span>
            <div className="space-y-2">
              {personnel.map((person) => (
                <button
                  key={person}
                  type="button"
                  onClick={() => setAssignedTo(person)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                    assignedTo === person
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-line text-ink/60 hover:bg-surface'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      assignedTo === person ? 'bg-emerald-600 text-white' : 'bg-surface text-ink/50'
                    }`}
                  >
                    {person.charAt(0)}
                  </div>
                  {person}
                  {assignedTo === person && <CheckIcon className="w-4 h-4 ml-auto text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-full text-sm transition shadow-md shadow-emerald-200 mt-1"
          >
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}
