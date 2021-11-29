import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public keys: string[] = [];
  public engine = localStorage;

  constructor() {}

  /**
   * Changes the storage engine to localStorage
   */
  public local() {
    this.engine = localStorage;
    return this;
  }

  /**
   * Changes the storage engine to sessionStorage
   */
  public session() {
    this.engine = sessionStorage;
    return this;
  }

  /**
   * Stores an item in the local or session storage and returns itself
   * for chaining
   *
   * @param key Key of Item to Store
   * @param value Item to store. Can be of any type
   * @param duration Duration of storage
   * @param unit Unit of storage duration, e.g. days, months, weeks, hours, minutes, seconds
   */
  public set(key: string, value: any, duration: any = 1, unit = 'days') {
    const data = {
      created: moment().valueOf(),
      data: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
      expires: moment().add(duration, unit).valueOf()
    };

    this.engine.setItem(key, JSON.stringify(data));
    this.storeKey(key);

    return this;
  }

  /**
   * Returns an item from the current storage engine or null if not found
   *
   * @param key Key of item to return
   */
  public get(key) {
    let result = null;

    this.storeKey(key);

    try {
      result = JSON.parse(this.engine.getItem(key));

      if (result && this.isResultExpired(result)) {
        this.engine.removeItem(key);
        return null;
      }
    } catch (e) {
      return null;
    }

    try {
      return JSON.parse(result.data);
    } catch (e) {
      // this.engine.removeItem(key);
      return result && result.data;
    }
  }

  /**
   * Removes an item from the current storage engine
   *
   * @param key Key of item to remove
   */
  public remove(key: string) {
    if (this.has(key)) {
      this.engine.removeItem(key);
    }
  }

  /**
   * Returns true if item is present in the current storage engine
   *
   * @param key Key of item to check
   */
  public has(key: string) {
    return this.get(key) != null;
  }

  public isValid(key: string) {
    if (this.has(key)) {
      try {
        const result = JSON.parse(this.engine.getItem(key));
        return this.isResultExpired(result) === false;
      } catch (e) {}
    }

    return false;
  }

  /**
   * Returns true if result object is expired
   *
   * @param result
   */
  private isResultExpired(result) {
    return result && moment(result.expires).isBefore(moment(), 'minute');
  }

  /**
   * Store an internal cache of items in localstorage
   * @param key Identifier of item stored
   */
  private storeKey(key: string) {
    if (this.keys.indexOf(key) === -1) {
      this.keys.push(key);
    }
  }

  /**
   * Removes all data from storage except the items specified
   *
   * @param exceptions Array of keys to exclude
   */
  public clearAll(exceptions: string[]) {
    this.keys
      .filter(key => exceptions.indexOf(key) === -1)
      .forEach(key => this.remove(key));
  }
}
