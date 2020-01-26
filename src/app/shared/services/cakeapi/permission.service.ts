
import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { StorageService } from '../storage.service';
import { Permission } from '../../model/cakeapi/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends APIService {

  constructor(http: HttpClient, protected events: EventsService, public storage: StorageService) {
    super(http, events, storage);

    this.url = '/permissions';
    this.model = Permission;
    this.model_name = 'Permission';
  }

  findPermissions(options, page = 1, limit = 30) {
    let params = Object.assign(options, {
      page: page,
      limit: limit,
      sort: 'type:asc,name:asc'
    });

    return this.get(`${this.url}`, params).pipe(map(res => {
      return res['data'].map(data => new Permission(data));
    }));
  }

  permissionsForRole(role_id) {
    let params = {
      limit: 200
    }

    return this.get(`/roles/${role_id}/permissions`, params).pipe(map(res => {
      return res['data'].map(data => new Permission(data));
    }))
  }

  syncRolePermissions(options) {
    let params = Object.assign(options, {
      limit: 200
    });

    console.log(params);

    return this.post(`/roles/${params.role_id}/permissions`, params).pipe(map(res => {
      return res['data'].map(data => new Permission(data));
    }));
  }
}
