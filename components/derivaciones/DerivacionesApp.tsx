'use client';

import { useMemo, useState } from 'react';
import { DerivationCard } from './DerivationCard';
import { DerivationDetail } from './DerivationDetail';
import { Header } from './Header';
import { NewDerivationForm } from './NewDerivationForm';
import { STAGES } from './constants';
import { createSeed, isOverdue, nextCode, personnelFor, stageLabel, todayStr } from './helpers';
import { PlusIcon, SearchIcon, WarningIcon } from './icons';
import type { AdvancePayload } from './AdvanceModal';
import { useNow } from './useNow';
import type { Derivation } from './types';

type Draft = Pick<Derivation, 'title' | 'type' | 'requestedBy' | 'amount' | 'assignedTo'>;

export function DerivacionesApp({ nombre, rol }: { nombre: string; rol: string }) {
  const now = useNow();
  const [items, setItems] = useState<Derivation[]>(() => createSeed(Date.now()));
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const selected = selectedId ? items.find((d) => d.id === selectedId) ?? null : null;

  const overdueCount = useMemo(() => items.filter((d) => isOverdue(d, now)).length, [items, now]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((d) => isOverdue(d, now))
      .concat(items.filter((d) => !isOverdue(d, now)))
      .filter((d) => {
        if (!query) return true;
        return (
          d.title.toLowerCase().includes(query) ||
          d.code.toLowerCase().includes(query) ||
          d.requestedBy.toLowerCase().includes(query) ||
          stageLabel(d.currentStage).toLowerCase().includes(query) ||
          d.assignedTo.toLowerCase().includes(query)
        );
      });
  }, [items, now, search]);

  const replace = (updated: Derivation) =>
    setItems((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));

  const advance = ({ destination, assignedTo, tasks, comment }: AdvancePayload) => {
    if (!selected) return;
    const nextStage = selected.currentStage + 1;
    if (nextStage >= STAGES.length) return;

    replace({
      ...selected,
      currentStage: nextStage,
      assignedTo,
      stageEnteredAt: Date.now(),
      status: nextStage === STAGES.length - 1 ? 'completed' : 'active',
      history: [
        ...selected.history,
        {
          stage: nextStage,
          date: todayStr(),
          user: nombre,
          assignedTo,
          destination,
          tasks: tasks.length > 0 ? tasks : undefined,
          comment,
        },
      ],
    });
  };

  const finalize = () => {
    if (!selected) return;
    replace({
      ...selected,
      status: 'completed',
      history: [
        ...selected.history,
        {
          stage: selected.currentStage,
          date: todayStr(),
          user: nombre,
          assignedTo: selected.assignedTo,
          destination: 'Archivos',
        },
      ],
    });
  };

  const create = (draft: Draft) => {
    setItems((prev) => {
      const today = todayStr();
      const item: Derivation = {
        id: `${Date.now()}-${prev.length}`,
        code: nextCode(prev),
        title: draft.title,
        type: draft.type,
        requestedBy: draft.requestedBy,
        amount: draft.amount,
        createdAt: today,
        currentStage: 0,
        assignedTo: draft.assignedTo,
        stageEnteredAt: Date.now(),
        status: 'active',
        history: [{ stage: 0, date: today, user: nombre, assignedTo: draft.assignedTo }],
      };
      return [item, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header nombre={nombre} rol={rol} overdueCount={overdueCount} />

      {selected ? (
        <DerivationDetail
          derivation={selected}
          now={now}
          onBack={() => setSelectedId(null)}
          onAdvance={advance}
          onFinalize={finalize}
        />
      ) : (
        <div className="max-w-xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-ink">Derivaciones</h1>
            <button
              type="button"
              onClick={() => setShowNew(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition shadow-md shadow-emerald-200"
            >
              <PlusIcon className="w-4 h-4" />
              Nueva
            </button>
          </div>

          <div className="relative mb-5">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/35" />
            <input
              type="search"
              aria-label="Buscar derivaciones"
              className="w-full pl-11 pr-4 py-3 rounded-full border border-line text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder:text-ink/35"
              placeholder="Buscar por nombre, código o etapa…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {overdueCount > 0 && !search && (
            <div className="flex items-center gap-2 mb-3">
              <WarningIcon className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">
                Vencidas — requieren atención
              </span>
            </div>
          )}

          {visible.length === 0 ? (
            <p className="text-center py-16 text-sm text-ink/35">Sin resultados</p>
          ) : (
            <div className="space-y-3">
              {visible.map((d, i) => {
                const prevOverdue = i > 0 && isOverdue(visible[i - 1], now);
                const showDivider = !search && prevOverdue && !isOverdue(d, now);

                return (
                  <div key={d.id}>
                    {showDivider && (
                      <div className="flex items-center gap-2 my-4">
                        <div className="flex-1 h-px bg-line" />
                        <span className="text-[10px] text-ink/35 font-medium uppercase tracking-wide">
                          En tiempo
                        </span>
                        <div className="flex-1 h-px bg-line" />
                      </div>
                    )}
                    <DerivationCard
                      derivation={d}
                      now={now}
                      onClick={() => setSelectedId(d.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showNew && (
        <NewDerivationForm
          personnel={personnelFor(0)}
          onClose={() => setShowNew(false)}
          onCreate={create}
        />
      )}
    </div>
  );
}
