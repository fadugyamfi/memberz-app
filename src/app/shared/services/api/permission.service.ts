
import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { StorageService } from '../storage.service';
import { Permission } from '../../model/api/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends APIService<Permission> {

  constructor(http: HttpClient, protected events: EventsService, public storage: StorageService) {
    super(http, events, storage);

    this.url = '/permissions';
    this.model = Permission;
    this.model_name = 'Permission';
  }

  findPermissions(options, page = 1, limit = 30) {
    const params = Object.assign(options, {
      page,
      limit,
      sort: 'type:asc,name:asc'
    });

    return this.get(`${this.url}`, params).pipe(map(res => {
      return res['data'].map(data => new Permission(data));
    }));
  }

  permissionsForRole(role_id) {
    const params = {
      limit: 200
    };

    return this.get(`/roles/${role_id}/permissions`, params).pipe(map(res => {
      return res['data'].map(data => new Permission(data));
    }));
  }

  syncRolePermissions(options) {
    const params = Object.assign(options, {
      limit: 200
    });

    return this.post(`/roles/${params.role_id}/permissions`, params).pipe(map(res => {
      return res['data'].map(data => new Permission(data));
    }));
  }
}
