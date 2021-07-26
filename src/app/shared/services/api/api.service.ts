
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpEventType } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EventsService } from '../events.service';
import { AppModel } from '../../model/api/app.model';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  protected BASE_URL = '';
  public _url: string;
  public model: any;
  public _model_name: string;
  public httpOptions;

  private _requesting = false;
  public uploadedPercentage = 0;
  public pagingMeta: any = {
    from: 1,
    total: 1
  };

  public selectedModel: AppModel;
  public results = null;

  public batchRequests = [];

  public cache = {};
  public cacheKey = '';

  public authService: AuthService;

  constructor(
    protected http: HttpClient,
    protected events: EventsService,
    protected storage: StorageService
  ) {
    this._url = '/';
    this.model = AppModel;
    this.model_name = 'AppModel';

    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.setApiUrl();
  }

  set model_name(value) {
    this._model_name = value;
    this.cacheKey = `searched_${this.model_name.toLowerCase()}_cache`;
  }

  get model_name() {
    return this._model_name;
  }

  // getApiCredentials() {
  //   const loginUser = this.authData.getUserAuthData();
  //   let token = btoa(`${''}:${''}`);
  //   if (loginUser) {
  //     const app = loginUser.data.app_client;
  //     token = btoa(`${app.client_id}:${app.client_secret}`);
  //   }
  //   return {
  //     'Authorization': `Basic ${token}`
  //   }
  // }

  getUserAuthorization() {
    const auth = this.storage.get('auth');

    if (auth) {
      return {
        'Authorization': `Bearer ${auth.access_token}`
      };
    }

    return {};
  }

  setApiUrl() {
    // set Base URL from cache
    this.BASE_URL = environment.api.url;
    // let auth_data = this.authData.getUserAuthData();
    // if (auth_data) {
    //   this.BASE_URL = auth_data['data']['institution']['api_url']
    // }
  }

  set url(str: string) {
    this._url = str.charAt(0) !== '/' ? `/${str}` : str;
  }

  get url() {
    return this._url;
  }

  set requesting(value) {
    this._requesting = value;

    if (value) {
      this.events.trigger(`${this.model_name}:request`);
    } else {
      this.events.trigger(`${this.model_name}:request:completed`);
    }
  }

  get requesting() {
    return this._requesting;
  }

  setHttpHeaders(param_headers) {
    let hd = Object.assign({ 'Content-Type': 'application/json' }, this.getUserAuthorization());

    if (this.storage.has('auth')) {
      const auth = this.storage.get('auth');
      hd = Object.assign(hd, {
        'Authorization': `Bearer ${auth.access_token}`
      });
    }

    if (param_headers) {
      hd = Object.assign(hd, param_headers);
    }

    this.httpOptions = {
      headers: new HttpHeaders(hd)
    };
  }
  /**
   * Performs an HTTP GET request and returns the Observable
   * object for subscription
   *
   * @param url Endpoint url segment
   * @param params Query Parameters
   */
  public get(url: string, params: object = null, param_headers: object = null): Observable<Object> {
    const full_url = this.BASE_URL + url;
    this.setHttpHeaders(param_headers);
    this.httpOptions['params'] = this.removeEmpty(params);

    this.requesting = true;

    return this.http.get(full_url, this.httpOptions).pipe(map(res => {
      this.requesting = false;
      this.processMeta(res);
      return res;
    }));
  }


  public processMeta(response) {
    if (response['meta']) {
      this.pagingMeta = response['meta'];
      setTimeout(() => this.events.trigger(`${this.model_name}:paging`, this.pagingMeta), 500);
    }
  }

  /**
   * Performs an HTTP POST request and returns the Observable
   * object for subscription
   *
   * @param url Endpoint url segment
   * @param params Body Form Data
   * @param qparams Query Parameters
   */
  public post(url: string, params: object | string, qparams: object = null, param_headers: object = null): Observable<Object> {
    const full_url = this.BASE_URL + url;
    this.setHttpHeaders(param_headers);
    this.httpOptions['params'] = qparams;

    this.requesting = true;

    return this.http.post(full_url, params, this.httpOptions).pipe(map(res => {
      this.requesting = false;
      this.processMeta(res);
      return res;
    }));
  }

  /**
   * Performs an HTTP POST request and returns the Observable
   * object for subscription
   *
   * @param url Endpoint url segment
   * @param params Body Form Data
   * @param qparams Query Parameters
   */
  public put(url: string, params: object, qparams: object = null, param_headers: object = null): Observable<Object> {
    const full_url = this.BASE_URL + url;
    this.setHttpHeaders(param_headers);
    this.httpOptions['params'] = qparams;

    this.requesting = true;

    return this.http.put(full_url, params, this.httpOptions).pipe(map(res => {
      this.requesting = false;
      this.processMeta(res);
      return res;
    }));
  }

  /**
   * Performs an HTTP DELETE request and returns the Observable object
   * for subscription
   *
   * @param url URL to query
   * @param params Query Parameters
   */
  public delete(url, params: object = null, param_headers: object = null): Observable<Object> {
    const full_url = this.BASE_URL + url;
    this.setHttpHeaders(param_headers);
    this.httpOptions['params'] = params;

    this.requesting = true;

    return this.http.delete(full_url, this.httpOptions).pipe(map(res => {
      this.requesting = false;
      return res;
    }));
  }

  public paging() {
    return this.pagingMeta;
  }

  public getSelectedModel(): any {
    return this.selectedModel;
  }

  public setSelectedModel(model) {
    this.selectedModel = model;
    this.events.trigger(`${this.model_name}:selected`, model);
  }

  public clearSelectedModel() {
    this.setSelectedModel = null;
  }

  /**
   * Returns an observable array of AppModel objects
   */
  getAll<T>(params: object = {}, headers = {}): Observable<T> {
    if (params['cacheResults']) {
      const results = this.fetchCachedData(true);

      if (results && results.length > 0) {
        return of(results);
      }
    }

    return this.get(this.url, params, headers).pipe(map((res) => {

      if (params['cacheResults']) {
        this.updateCache(res['data'], params['cacheToLocal']);
      }

      this.results = res['data'].map(data => new this.model(data));
      return this.results;
    }));
  }

  /**
   * Get a specific record by ID
   * @param id ID of record
   * @param params Query parameters to pass in for additional filtering
   */
  getById(id, params: object = null): Observable<AppModel> {
    return this.get(`${this.url}/${id}`, params).pipe(map(res => new this.model(res['data'])));
  }

  /**
   * Creates a record on the server at the specified endpoint
   *
   * @param model Model data to pass
   */
  create(model: AppModel, qparams: object = null) {

    return this.post(`${this.url}`, model, qparams).pipe(
      map((response) => new this.model(response['data'])))
      .subscribe(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        (model) => {
          this.setSelectedModel(model);
          this.clearCache();
          this.events.trigger(`${this.model_name}:created`, model);
        },
        (error: HttpErrorResponse) => {
          this.requesting = false;
          this.events.trigger(`${this.model_name}:create:error`, error);
          this.triggerError(error);
        }
      );
  }

  /**
   * Updates a record on the server at the specified endpoint
   *
   * @param model Model data to pass
   */
  update(model: AppModel, qparams: object = null) {

    return this.put(`${this.url}/${model.id}`, model, qparams).pipe(
      map((response) => new this.model(response['data'])))
      .subscribe(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        (model) => {
          this.setSelectedModel(model);
          this.clearCache();
          this.events.trigger(`${this.model_name}:updated`, model);
        },
        (error: HttpErrorResponse) => {
          this.requesting = false;
          this.events.trigger(`${this.model_name}:update:error`, error);
          this.triggerError(error);
        }
      );
  }

  /**
   * DELETEs a resource record from the specified endpoint
   *
   * @param model Model data to work with
   */
  remove(model: AppModel, qparams: object = null) {

    if (!model.id) {
      return;
    }

    return this.delete(`${this.url}/${model.id}`, qparams).subscribe(
      (data) => {
        this.setSelectedModel(null); // clear any cached data
        this.clearCache();
        this.events.trigger(`${this.model_name}:deleted`, model, data);
      },
      (error) => {
        this.requesting = false;
        this.events.trigger(`${this.model_name}:delete:error`, error);
        this.triggerError(error);
      }
    );
  }

  /**
   * Requests a count of records in the endpoint that meet a specified criteria
   */
  count(params) {
    return this.get(`${this.url}/count`, params);
  }

  search<T>(params): Observable<T> {
    return this.get(`${this.url}/search`, params).pipe(map((res) => {
      return this.results = res['data'].map(data => new this.model(data));
    }));
  }

  /**
   * Adds a new student photo record and uploads the id image if available
   *
   * @param model AppModel
   * @param qparams Query parameters
   */
  createWithUpload(model: AppModel, qparams: any = null) {
    const hd = Object.assign({ 'Accept': 'multipart/form-data' });

    // const headers = new HttpHeaders(hd);
    const reportProgress = true;
    const params = new HttpParams({ fromObject: qparams });
    const formData: FormData = new FormData();
    this.setHttpHeaders(hd);

    for (const key in model) {
      if (typeof model[key] !== 'function' && model[key] != null) {
        formData.append(key, model[key]);
      }
    }
console.log(formData);
    return this.http.post(this.BASE_URL + this.url, formData, {
      reportProgress, params, headers: this.httpOptions.headers, observe: 'events'
    })
      .subscribe(
        (event) => {
          this.handleUploadProgress(event, (res) => {
            this.events.trigger(`${this.model_name}:created`, new this.model(res['data']));
          });
        },
        (error) => {
          this.requesting = false;
          this.triggerError(error);
        }
      );
  }

  /**
   * Updates a student photo record and uploads the id image if available
   *
   * @param model Model to work on
   * @param qparams Query params
   */
  updateWithUpload(model: AppModel, qparams: any = null) {
    const hd = Object.assign({ 'Accept': 'multipart/form-data' });

    // const headers = new HttpHeaders(hd);
    const params = new HttpParams({ fromObject: qparams });
    const formData: FormData = new FormData();
    const reportProgress = true;
    this.setHttpHeaders(hd);

    for (const key in model) {
      if (typeof model[key] !== 'function' && model[key] != null) {
        formData.append(key, model[key]);
      }
    }

    return this.http.post(this.BASE_URL + this.url + `/${model.id}`, formData, {
      reportProgress, params, headers: this.httpOptions.headers, observe: 'events'
    })
      .subscribe(
        (event) => {
          this.handleUploadProgress(event, (res) => {
            this.events.trigger(`${this.model_name}:updated`, new this.model(res['data']));
          });
        },
        (error) => {
          this.requesting = false;
          this.triggerError(error);
        }
      );
  }

  handleUploadProgress(event, callback = null) {
    switch (event.type) {
      case HttpEventType.Sent:
        this.requesting = true;
        this.events.trigger(`${this.model_name}:upload:start`);
        break;
      case HttpEventType.Response:
        this.requesting = false;
        this.events.trigger(`${this.model_name}:upload:complete`);
        if (callback) {
          callback(event.body);
        }
        break;
      case 1: {
        if (Math.round(this.uploadedPercentage) !== Math.round(event['loaded'] / event['total'] * 100)) {
          this.uploadedPercentage = event['loaded'] / event['total'] * 100;
          this.events.trigger(`${this.model_name}:upload:progress`, Math.round(this.uploadedPercentage));
        }
        break;
      }
    }
  }

  getError(msg: string) {
    return {
      title: 'Record Save Failed',
      msg: msg,
      type: 'error',
      closeOther: true
    };
  }

  removeEmpty(obj) {
    try {
      if (obj) {
        const o = JSON.parse(JSON.stringify(obj)); // Clone source oect.

        Object.keys(o).forEach(key => {
          if (o[key] && typeof o[key] === 'object') { // Recurse.
            o[key] = this.removeEmpty(o[key]);
          } else if (o[key] === undefined || o[key] === null || o[key] === '') { // Delete undefined and null.
            delete o[key];
          } else { // Copy value.
            o[key] = o[key];
          }
        });

        return o; // Return new object.
      }

    } catch (e) {
      console.log(obj);
      console.log(e);
    }

    return null;
  }

  /**
   * Trigger an error event
   *
   * @param error object
   */
  triggerError(error) {
    let message = error.error && error.error.message ? error.error.message : null;

    if (message && Array.isArray(message)) {
      message = message.join('<br />');
    } else if (!message) {
      message = 'An unexpected error occurred';
    }

    this.events.trigger('toast', this.getError(message));
  }

  /**
   *
   * @param requests Array of requests
   * @param qparams Query parameters
   */
  batch(requests: Array<object>, qparams: object = null) {
    return this.post('/batch', requests, qparams).pipe(map(res => {
      const responses = [];

      Object.values(res['responses']).forEach(resp => {
        if (resp['data']) {
          if (Array.isArray(resp['data'])) {
            responses.push(...resp['data'].map(d => new this.model(d)));
          } else {
            responses.push(new this.model(resp['data']));
          }
        } else {
          responses.push(resp);
        }
      });

      return responses;
    }));
  }

  /**
   * Returns a batch request data
   *
   * @param url URL to request
   * @param method Type of request, i.e GET, POST, PUT, DELETE
   * @param params Query or body params
   */
  buildBatchRequest(url: string, method: string, params: object = {}) {
    const id = (Math.random() * 10000).toFixed(0);

    return {
      'request_id': `${this.model_name}:${method}:${id}`,
      'url': '/api' + url,
      'method': method,
      'params': params
    };
  }

  /**
   * Create multiple records on the server at once
   *
   * @param models Array of models
   */
  batchCreate(models: AppModel[], qparams: object = {}) {
    const requests = models.map(model => {
      return this.buildBatchRequest(`${this.url}`, 'POST', model);
    });

    return this.batch(requests, qparams).subscribe(
      (data) => this.processBatchResponses(data, 'created'),
      (error: HttpErrorResponse) => {
        this.requesting = false;
        this.triggerError(error);
      }
    );
  }

  /**
   * Update multiple records on the server at once
   *
   * @param models Array of Models
   */
  batchUpdate(models: AppModel[], qparams: object = {}) {
    const requests = models.map(model => {
      if (model.id) {
        return this.buildBatchRequest(`${this.url}/${model.id}`, 'PUT', model);
      }
      return this.buildBatchRequest(`${this.url}`, 'POST', model);
    });

    return this.batch(requests, qparams).subscribe(
      (data) => this.processBatchResponses(data, 'updated'),
      (error: HttpErrorResponse) => {
        this.requesting = false;
        this.triggerError(error);
      }
    );
  }

  /**
   * Delete multiple records from the server at once
   *
   * @param models Array of Models
   */
  batchDelete(models: AppModel[], qparams: object = {}) {
    const requests = models.map(model => {
      return this.buildBatchRequest(`${this.url}/${model.id}`, 'DELETE');
    });

    return this.batch(requests, qparams).subscribe(
      (data) => this.processBatchResponses(data, 'deleted'),
      (error: HttpErrorResponse) => {
        this.requesting = false;
        this.triggerError(error);
      }
    );
  }

  /**
   * Process and trigger events for the responses from the batch request
   *
   * @param data Data to process
   * @param action Method calling processing
   */
  processBatchResponses(data, action) {

    data.forEach(response => {
      if (Array.isArray(response)) {
        response.forEach(model => this.events.trigger(`${this.model_name}:${action}`, model));
      } else if (response instanceof AppModel) {
        this.events.trigger(`${this.model_name}:${action}`, response);
      } else if (response.status && response.status === 'success') {
        this.events.trigger('toast', {
          title: 'Record Save Success',
          msg: response.message,
          type: 'info'
        });
      } else {
        this.triggerError(response);
      }
    });
  }

  findInCache(params) {
    const results = [];

    if (!this.cache) {
      this.cache = this.fetchCachedData();
    }

    if (params.id) {
      for (const id in this.cache) {
        if (id === params.id) {
          results.push(new this.model(this.cache[id]));
        }
      }
    }

    return results;
  }

  updateCache(data: Array<any>, local = false) {
    data.forEach(d => this.cache[d.id] = d);

    if (local) {
      localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
    } else {
      sessionStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
    }
  }

  clearCache() {
    localStorage.removeItem(this.cacheKey);
    sessionStorage.removeItem(this.cacheKey);
  }

  getCachedData() {
    return localStorage.getItem(this.cacheKey) || sessionStorage.getItem(this.cacheKey);
  }

  fetchCachedData(asArray = false) {
    try {
      const data = JSON.parse(this.getCachedData());

      if (asArray) {
        const results = [];
        for (const id in data) {
          if ( data.hasOwnProperty(id) ) {
             results.push(new this.model(data[id]));
          }
        }

        return results;
      }

      return data;

    } catch (e) {
      return {};
    }
  }
}
