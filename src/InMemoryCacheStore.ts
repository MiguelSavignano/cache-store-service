import { ICacheProvider } from "./CacheService";

export class InMemoryCacheStore implements ICacheProvider {
  public store: any;
  constructor(store = {}) {
    this.store = store;
  }

  public get(key: string, callback:
    (error: any, data: any) => void) {
    callback(null, this.store[key]);
  }

  public set(key: string, data: any, typeExpiration?: string, expirationTimeInseconds?: number) {
    if (typeExpiration === "EX") {
      expirationTimeInseconds = expirationTimeInseconds || 1000 * 60;
      this.store[key] = data;
      setTimeout(() => {
        delete this.store[key];
      }, expirationTimeInseconds);
      return data;
    } else {
      this.store[key] = data;
      return data;
    }
  }
}

export default InMemoryCacheStore;
