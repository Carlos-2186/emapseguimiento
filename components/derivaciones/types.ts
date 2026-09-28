export type Stage = {
  id: string;
  label: string;
};

export type DerivationStatus = 'active' | 'completed' | 'rejected';

export type DerivationType = 'bien' | 'servicio';

export type HistoryEntry = {
  stage: number;
  date: string;
  user: string;
  assignedTo: string;
  destination?: string;
  tasks?: string[];
  comment?: string;
};

export type Derivation = {
  id: string;
  code: string;
  title: string;
  type: DerivationType;
  requestedBy: string;
  amount: number;
  createdAt: string;
  currentStage: number;
  assignedTo: string;
  stageEnteredAt: number;
  status: DerivationStatus;
  history: HistoryEntry[];
};
