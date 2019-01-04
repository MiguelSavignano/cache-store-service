const sha1 = require('sha1');
import InMemoryCacheStore from './InMemoryCacheStore'

export interface CacheProvider {
  get: (key: string, callback: (error: any, data: any) => void) => void
  set: (key: string, data: any, typeExpiration?: string, expirationTimeInseconds?: number) => void
}

export interface RequesterProvider {
  get: (url: string, { params, headers, ...restAxiosOptions }) => Promise<{ data: any }>
}

export class CacheService {
  cacheProvider: CacheProvider;
  requester: RequesterProvider;
  constructor(cacheProvider: CacheProvider = new InMemoryCacheStore(), requester?: RequesterProvider) {
    this.cacheProvider = cacheProvider;
    this.requester = requester;
  }

  fetch(key: string, timeInseconds?: number) {
    return promise =>
      new Promise((resolve, reject) => {
        this.cacheProvider.get(key, (err, dataRedis) => {
          if (err || !dataRedis) {
            promise
              .then(data => {
                if (timeInseconds) {
                  this.cacheProvider.set(
                    key,
                    JSON.stringify(data),
                    'EX',
                    timeInseconds,
                  );
                } else {
                  this.cacheProvider.set(key, JSON.stringify(data));
                }
                resolve(data);
              })
              .catch(reject);
          } else {
            resolve(JSON.parse(dataRedis));
          }
        });
      });
  }

  fetchHttp(keyPrefix: string, timeInseconds?: number) {
    return (
      url: string,
      { params = {}, headers = {}, ...restAxiosOptions }: any,
    ) => {
      const key = this.generateHttpKey({ ...params }, { ...headers });
      const promise = new Promise((resolve, reject) => {
        this.requester
          .get(url, { params, headers, ...restAxiosOptions })
          .then(response => {
            resolve(response.data);
          })
          .catch(reject);
      });

      return this.fetch(`${keyPrefix}-${key}`, timeInseconds)(promise);
    };
  }

  generateHttpKey(params = {}, headers = {}) {
    return `${sha1(JSON.stringify({ ...params, ...headers }))}`;
  }
}

export default CacheService

// import CacheService from 'cache-service'
// cacheService = new cacheService(new Redis(), axios)
// cacheService = new cacheService({memoryCache: memoryCache, requester: axios})
