import { CacheProvider } from './CacheService'

export class InMemoryCacheStore implements CacheProvider {
  store: any
  constructor(store = {}) {
    this.store = store
  }

  get(key: string, callback:
    (error: any, data: any) => void) {
    callback(null, this.store[key])
  }

  set(key: string, data: any, typeExpiration?: string, expirationTimeInseconds?: number) {
    if (typeExpiration == "EX") {
      const _expirationTimeInseconds = expirationTimeInseconds || 1000 * 60
      this.store[key] = data
      setTimeout(() => {
        delete this.store[key]
      }, _expirationTimeInseconds)
      return data
    } else {
      this.store[key] = data
      return data
    }
  }
}

export default InMemoryCacheStore
