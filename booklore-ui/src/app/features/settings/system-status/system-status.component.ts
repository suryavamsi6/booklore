import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslocoDirective} from '@jsverse/transloco';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Tag} from 'primeng/tag';
import {Message} from 'primeng/message';
import {SystemStatusService} from './system-status.service';
import {
  BackupStatus,
  BackupValidationRecord,
  HealthStatus,
  InstanceReadinessStatus,
  OperationalHealthCheck,
  ReadinessState
} from '../../../shared/models/system-status.model';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    ProgressSpinner,
    Tag,
    Message,
  ],
  templateUrl: './system-status.component.html',
  styleUrl: './system-status.component.scss'
})
export class SystemStatusComponent implements OnInit {
  private readonly systemStatusService = inject(SystemStatusService);

  readiness: InstanceReadinessStatus | null = null;
  healthChecks: OperationalHealthCheck[] = [];
  backupValidation: BackupValidationRecord | null = null;

  readinessLoading = true;
  healthLoading = true;
  backupLoading = true;

  readinessError = false;
  healthError = false;
  backupError = false;

  ReadinessState = ReadinessState;
  HealthStatus = HealthStatus;
  BackupStatus = BackupStatus;

  ngOnInit(): void {
    this.loadReadiness();
    this.loadHealthChecks();
    this.loadBackupValidation();
  }

  loadReadiness(): void {
    this.readinessLoading = true;
    this.readinessError = false;
    this.systemStatusService.getReadiness().subscribe({
      next: (data) => {
        this.readiness = data;
        this.readinessLoading = false;
      },
      error: () => {
        this.readinessError = true;
        this.readinessLoading = false;
      }
    });
  }

  loadHealthChecks(): void {
    this.healthLoading = true;
    this.healthError = false;
    this.systemStatusService.getHealthChecks().subscribe({
      next: (data) => {
        this.healthChecks = data;
        this.healthLoading = false;
      },
      error: () => {
        this.healthError = true;
        this.healthLoading = false;
      }
    });
  }

  loadBackupValidation(): void {
    this.backupLoading = true;
    this.backupError = false;
    this.systemStatusService.getBackupValidation().subscribe({
      next: (data) => {
        this.backupValidation = data;
        this.backupLoading = false;
      },
      error: () => {
        this.backupError = true;
        this.backupLoading = false;
      }
    });
  }

  getReadinessSeverity(state: ReadinessState): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (state) {
      case ReadinessState.READY:
        return 'success';
      case ReadinessState.READY_WITH_WARNINGS:
        return 'warn';
      case ReadinessState.SETUP_INCOMPLETE:
      case ReadinessState.DEGRADED:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getHealthSeverity(status: HealthStatus): 'success' | 'warn' | 'danger' {
    switch (status) {
      case HealthStatus.HEALTHY:
        return 'success';
      case HealthStatus.WARNING:
        return 'warn';
      case HealthStatus.UNHEALTHY:
        return 'danger';
    }
  }

  getHealthIcon(status: HealthStatus): string {
    switch (status) {
      case HealthStatus.HEALTHY:
        return 'pi pi-check-circle';
      case HealthStatus.WARNING:
        return 'pi pi-exclamation-triangle';
      case HealthStatus.UNHEALTHY:
        return 'pi pi-times-circle';
    }
  }

  getBackupSeverity(status: BackupStatus): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case BackupStatus.VALIDATED:
        return 'success';
      case BackupStatus.RECENT:
        return 'success';
      case BackupStatus.STALE:
        return 'warn';
      case BackupStatus.NOT_AVAILABLE:
        return 'danger';
    }
  }

  getBackupIcon(status: BackupStatus): string {
    switch (status) {
      case BackupStatus.VALIDATED:
      case BackupStatus.RECENT:
        return 'pi pi-verified';
      case BackupStatus.STALE:
        return 'pi pi-exclamation-triangle';
      case BackupStatus.NOT_AVAILABLE:
        return 'pi pi-times-circle';
    }
  }

  formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(dateStr));
  }
}
