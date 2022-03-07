import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SystemSetting } from '../../model/api/system-setting';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingService extends APIService<SystemSetting> {

  private systemSettings: SystemSetting[] = [];

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/system/settings';
    this.model = SystemSetting;
    this.model_name = 'SystemSetting';

    this.loadSystemSettings();
  }

  loadSystemSettings() {
    this.getAll().subscribe({
      next: (settings) => {
        this.systemSettings = settings;
      }
    })
  }

  isNewExperienceTrialEnabled() {
    const setting = this.systemSettings.find(setting => setting.name == 'try_new_platform');

    return setting?.value == 1;
  }
}
