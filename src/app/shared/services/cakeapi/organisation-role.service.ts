import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationRole } from '../../model/cakeapi/organisation-role';
import { StorageService } from '../storage.service';
import { map } from 'rxjs/operators';
import { Permission } from '../../model/cakeapi/permission.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationRoleService extends APIService {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_roles';
    this.model =  OrganisationRole;
    this.model_name = 'OrganisationRole';
  }

  permissions(role_id) {
    const params = {
      limit: 300
    }

    return this.get(`${this.url}/${role_id}/permissions`, params).pipe(map(res => {
      return res['data'].map(data => new Permission(data));
    }));
  }

  syncPermissions(options) {
    const params = {
      limit: 300,
      count: ['user', 'permission'].join()
    };

    return this.post(`/roles/${options.role_id}/permissions`, options, params).pipe(map(res => {
      const returnData = res['data'];
      this.events.trigger('OrganisationRole:permissionSynced', returnData);
      return returnData;
    }));
  }
}
