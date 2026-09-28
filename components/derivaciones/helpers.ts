import { ALERT_MS, STAGES, STAGE_PERSONNEL } from './constants';
import type { Derivation } from './types';

const HOUR = 60 * 60 * 1000;

const groupThousands = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const fmtUSD = (n: number) => {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? '-' : '';
  return `${sign}$${groupThousands(String(Math.abs(rounded)))}`;
};

export const todayStr = () =>
  new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

export const stageLabel = (index: number) => STAGES[index]?.label ?? '—';

export const personnelFor = (index: number) =>
  STAGE_PERSONNEL[STAGES[index]?.id ?? ''] ?? [];

export const isOverdue = (d: Derivation, now: number | null) =>
  d.status === 'active' && now !== null && now - d.stageEnteredAt > ALERT_MS;

export const timeLabel = (d: Derivation, now: number | null) => {
  if (d.status !== 'active' || now === null) return null;
  const elapsed = now - d.stageEnteredAt;
  const remaining = Math.abs(elapsed - ALERT_MS);
  const h = Math.floor(remaining / HOUR);
  const m = Math.floor((remaining % HOUR) / 60000);
  if (elapsed > ALERT_MS) return `Vencido hace ${h}h ${m}m`;
  return `Vence en ${h}h ${m}m`;
};

export const nextCode = (items: Derivation[]) => {
  const highest = items.reduce((max, d) => {
    const n = Number.parseInt(d.code.replace(/\D/g, ''), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `DER-${String(highest + 1).padStart(3, '0')}`;
};

export const createSeed = (now: number): Derivation[] => [
  {
    id: '1',
    code: 'DER-001',
    title: 'Equipos de cómputo',
    type: 'bien',
    requestedBy: 'María González',
    amount: 45000,
    createdAt: '10 Nov',
    currentStage: 5,
    assignedTo: 'Pedro Salas',
    stageEnteredAt: now - 52 * HOUR,
    status: 'active',
    history: [
      { stage: 0, date: '10 Nov', user: 'M. González', assignedTo: 'Carlos Méndez' },
      { stage: 1, date: '12 Nov', user: 'M. González', assignedTo: 'Laura Ríos' },
      { stage: 2, date: '14 Nov', user: 'Laura Ríos', assignedTo: 'Andrés Vega' },
      { stage: 3, date: '16 Nov', user: 'Andrés Vega', assignedTo: 'Laura Ríos' },
      { stage: 4, date: '18 Nov', user: 'Laura Ríos', assignedTo: 'Sistema RPA' },
      { stage: 5, date: '20 Nov', user: 'Sistema RPA', assignedTo: 'Pedro Salas' },
    ],
  },
  {
    id: '2',
    code: 'DER-002',
    title: 'Mantenimiento HVAC',
    type: 'servicio',
    requestedBy: 'Roberto Flores',
    amount: 18500,
    createdAt: '08 Nov',
    currentStage: 8,
    assignedTo: 'Dir. Suárez',
    stageEnteredAt: now - 10 * HOUR,
    status: 'completed',
    history: STAGES.map((s, i) => ({
      stage: i,
      date: `0${i + 8} Nov`,
      user: 'Sistema',
      assignedTo: STAGE_PERSONNEL[s.id][0],
    })),
  },
  {
    id: '3',
    code: 'DER-003',
    title: 'Licencias SAP',
    type: 'servicio',
    requestedBy: 'Ana Torres',
    amount: 92000,
    createdAt: '18 Nov',
    currentStage: 2,
    assignedTo: 'Andrés Vega',
    stageEnteredAt: now - 50 * HOUR,
    status: 'active',
    history: [
      { stage: 0, date: '18 Nov', user: 'A. Torres', assignedTo: 'Carlos Méndez' },
      { stage: 1, date: '19 Nov', user: 'Carlos Méndez', assignedTo: 'Laura Ríos' },
      { stage: 2, date: '21 Nov', user: 'Laura Ríos', assignedTo: 'Andrés Vega' },
    ],
  },
  {
    id: '4',
    code: 'DER-004',
    title: 'Mobiliario oficina',
    type: 'bien',
    requestedBy: 'Luis Paredes',
    amount: 12750,
    createdAt: '05 Nov',
    currentStage: 3,
    assignedTo: 'Laura Ríos',
    stageEnteredAt: now - 20 * HOUR,
    status: 'rejected',
    history: [
      { stage: 0, date: '05 Nov', user: 'L. Paredes', assignedTo: 'Carlos Méndez' },
      { stage: 1, date: '06 Nov', user: 'Carlos Méndez', assignedTo: 'Laura Ríos' },
      { stage: 2, date: '07 Nov', user: 'Laura Ríos', assignedTo: 'Andrés Vega' },
      { stage: 3, date: '09 Nov', user: 'Andrés Vega', assignedTo: 'Laura Ríos' },
    ],
  },
];
