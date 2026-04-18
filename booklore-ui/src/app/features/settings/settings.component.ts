import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {UserService} from './user-management/user.service';
import {AsyncPipe} from '@angular/common';
import {GlobalPreferencesComponent} from './global-preferences/global-preferences.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserManagementComponent} from './user-management/user-management.component';
import {AuthenticationSettingsComponent} from '../../core/security/oauth2-management/authentication-settings.component';
import {ViewPreferencesParentComponent} from './view-preferences-parent/view-preferences-parent.component';
import {ReaderPreferences} from './reader-preferences/reader-preferences.component';
import {FileNamingPatternComponent} from './file-naming-pattern/file-naming-pattern.component';
import {TaskManagementComponent} from './task-management/task-management.component';
import {AuditLogsComponent} from './audit-logs/audit-logs.component';
import {OpdsSettings} from './opds-settings/opds-settings';
import {MetadataSettingsComponent} from './metadata-settings/metadata-settings-component';
import {DeviceSettingsComponent} from './device-settings/device-settings-component';
import {LibraryMetadataSettingsComponent} from './library-metadata-settings/library-metadata-settings.component';
import {PageTitleService} from "../../shared/service/page-title.service";
import {EmailV2Component} from './email-v2/email-v2.component';
import {TranslocoDirective, TranslocoService} from '@jsverse/transloco';
import {SystemStatusComponent} from './system-status/system-status.component';

export enum SettingsTab {
  ReaderSettings = 'reader',
  ViewPreferences = 'view',
  DeviceSettings = 'device',
  UserManagement = 'user',
  EmailSettingsV2 = 'email-v2',
  NamingPattern = 'naming-pattern',
  MetadataSettings = 'metadata',
  LibraryMetadataSettings = 'metadata-library',
  ApplicationSettings = 'application',
  AuthenticationSettings = 'authentication',
  OpdsV2 = 'opds',
  Tasks = 'task',
  AuditLogs = 'audit-logs',
  SystemStatus = 'system-status',
}

@Component({
  selector: 'app-settings',
  imports: [
    AsyncPipe,
    GlobalPreferencesComponent,
    UserManagementComponent,
    AuthenticationSettingsComponent,
    ViewPreferencesParentComponent,
    ReaderPreferences,
    MetadataSettingsComponent,
    DeviceSettingsComponent,
    FileNamingPatternComponent,
    OpdsSettings,
    LibraryMetadataSettingsComponent,
    TaskManagementComponent,
    AuditLogsComponent,
    EmailV2Component,
    TranslocoDirective,
    SystemStatusComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {

  protected userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pageTitle = inject(PageTitleService);
  private transloco = inject(TranslocoService);

  private routeSub!: Subscription;

  SettingsTab = SettingsTab;

  private validTabs = Object.values(SettingsTab);
  private _activeTab: SettingsTab = SettingsTab.ReaderSettings;

  get activeTab(): SettingsTab {
    return this._activeTab;
  }

  set activeTab(value: SettingsTab) {
    this._activeTab = value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: value},
      queryParamsHandling: 'merge'
    });
  }

  ngOnInit(): void {
    this.pageTitle.setPageTitle('Settings');

    this.routeSub = this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'];
      if (this.validTabs.includes(tabParam)) {
        this._activeTab = tabParam as SettingsTab;
      } else {
        this._activeTab = SettingsTab.ReaderSettings;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {tab: this._activeTab},
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  getTabLabel(tab: SettingsTab): string {
    const translationKeyMap: Record<SettingsTab, string> = {
      [SettingsTab.ReaderSettings]: 'settings.tabs.reader',
      [SettingsTab.ViewPreferences]: 'settings.tabs.view',
      [SettingsTab.DeviceSettings]: 'settings.tabs.devices',
      [SettingsTab.UserManagement]: 'settings.tabs.users',
      [SettingsTab.EmailSettingsV2]: 'settings.tabs.email',
      [SettingsTab.NamingPattern]: 'settings.tabs.patterns',
      [SettingsTab.MetadataSettings]: 'settings.tabs.metadata1',
      [SettingsTab.LibraryMetadataSettings]: 'settings.tabs.metadata2',
      [SettingsTab.ApplicationSettings]: 'settings.tabs.application',
      [SettingsTab.AuthenticationSettings]: 'settings.tabs.authentication',
      [SettingsTab.OpdsV2]: 'settings.tabs.opds',
      [SettingsTab.Tasks]: 'settings.tabs.tasks',
      [SettingsTab.AuditLogs]: 'settings.tabs.auditLogs',
      [SettingsTab.SystemStatus]: 'settings.tabs.systemStatus'
    };

    return this.transloco.translate(translationKeyMap[tab]);
  }

  getTabDescription(tab: SettingsTab): string {
    const descriptionMap: Record<SettingsTab, string> = {
      [SettingsTab.ReaderSettings]: 'Reader defaults, fonts, and device-specific reading behavior.',
      [SettingsTab.ViewPreferences]: 'Layout, filters, and browsing defaults across the app.',
      [SettingsTab.DeviceSettings]: 'Sync targets and external device integrations.',
      [SettingsTab.UserManagement]: 'Accounts, permissions, and access boundaries.',
      [SettingsTab.EmailSettingsV2]: 'Outbound providers, recipients, and delivery settings.',
      [SettingsTab.NamingPattern]: 'File naming rules for imports, organization, and exports.',
      [SettingsTab.MetadataSettings]: 'Provider behavior, metadata persistence, and review defaults.',
      [SettingsTab.LibraryMetadataSettings]: 'Library-specific metadata overrides and source priorities.',
      [SettingsTab.ApplicationSettings]: 'Global appearance, file handling, and application-wide automation.',
      [SettingsTab.AuthenticationSettings]: 'OAuth, OIDC, and login security controls.',
      [SettingsTab.OpdsV2]: 'Catalog publishing and OPDS feed configuration.',
      [SettingsTab.Tasks]: 'Background jobs, queues, and operational controls.',
      [SettingsTab.AuditLogs]: 'Recent administrative activity and change history.',
      [SettingsTab.SystemStatus]: 'Health, storage, and runtime diagnostics.'
    };

    return descriptionMap[tab];
  }
}
