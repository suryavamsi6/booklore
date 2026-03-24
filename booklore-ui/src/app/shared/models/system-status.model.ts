export enum ReadinessState {
  UNINITIALIZED = 'UNINITIALIZED',
  SETUP_INCOMPLETE = 'SETUP_INCOMPLETE',
  READY_WITH_WARNINGS = 'READY_WITH_WARNINGS',
  READY = 'READY',
  DEGRADED = 'DEGRADED'
}

export enum StorageMode {
  LOCAL = 'LOCAL',
  NETWORK = 'NETWORK'
}

export enum StorageRiskLevel {
  NONE = 'NONE',
  WARNING = 'WARNING',
  BLOCKING = 'BLOCKING'
}

export interface InstanceReadinessStatus {
  installationId: string;
  setupComplete: boolean;
  adminProvisioned: boolean;
  storageMode: StorageMode;
  storageRiskLevel: StorageRiskLevel;
  databaseReachable: boolean;
  backgroundProcessingHealthy: boolean;
  librariesHealthy: boolean;
  state: ReadinessState;
  activeWarnings: string[];
  recommendedActions: string[];
  evaluatedAt: string;
}

export enum HealthComponent {
  API = 'API',
  DATABASE = 'DATABASE',
  LIBRARY_STORAGE = 'LIBRARY_STORAGE',
  BOOKDROP = 'BOOKDROP',
  TASKS = 'TASKS',
  SYNC = 'SYNC'
}

export enum HealthStatus {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  UNHEALTHY = 'UNHEALTHY'
}

export interface OperationalHealthCheck {
  component: HealthComponent;
  status: HealthStatus;
  summary: string;
  details?: string;
  nextAction?: string;
  updatedAt: string;
}

export enum BackupStatus {
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  STALE = 'STALE',
  RECENT = 'RECENT',
  VALIDATED = 'VALIDATED'
}

export interface BackupValidationRecord {
  status: BackupStatus;
  lastBackupDetectedAt?: string;
  includedComponents: string[];
  missingComponents: string[];
  appearsSufficient: boolean;
  guidance: string;
  evaluatedAt: string;
}
