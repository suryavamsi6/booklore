import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_CONFIG} from '../../../core/config/api-config';
import {BackupValidationRecord, InstanceReadinessStatus, OperationalHealthCheck} from '../../../shared/models/system-status.model';

@Injectable({providedIn: 'root'})
export class SystemStatusService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_CONFIG.BASE_URL}/api/v1/system-status`;

  getReadiness(): Observable<InstanceReadinessStatus> {
    return this.http.get<InstanceReadinessStatus>(`${this.baseUrl}/readiness`);
  }

  getHealthChecks(): Observable<OperationalHealthCheck[]> {
    return this.http.get<OperationalHealthCheck[]>(`${this.baseUrl}/health`);
  }

  getBackupValidation(): Observable<BackupValidationRecord> {
    return this.http.get<BackupValidationRecord>(`${this.baseUrl}/backup-validation`);
  }
}
