const Redis = require('ioredis');
import { CacheService } from './CacheService';
import { InMemoryCacheStore } from './InMemoryCacheStore';

const requesterMock: any = {
  get: async () => ({ data: [{ id: 1 }] }),
};

describe('CacheService', () => {
  let cacheService = new CacheService()
  it('#new', () => {
    expect(new CacheService()).toBeInstanceOf(CacheService);
  });

  it('#fetch string', async () => {
    const promise = Promise.resolve('data-to-cache')
    const response = await cacheService.fetch('cache-key-string', 1)(promise);
    expect(response).toEqual('data-to-cache');
  });

  it('#fetch object', async () => {
    const promise = Promise.resolve(({ id: 4 }));
    expect(await cacheService.fetch('cache-key-obj', 1)(promise)).toEqual({
      id: 4,
    });
  });

  // it('#fetch object redis', async () => {
  //   const cacheService = new CacheService(new Redis());
  //   const promise = Promise.resolve({ id: 4 });
  //   expect(await cacheService.fetch('cache-key-obj', 1)(promise)).toEqual({
  //     id: 4,
  //   });
  // });

  it('#generateHttpKey', async () => {
    const cacheService = new CacheService();
    const headers = { 'Conten-Type': 'application/json' };
    const params = { limit: 100 };
    expect(cacheService.generateHttpKey({ headers, params })).toEqual(
      'c91a80e5a045f6cb888ee6d84f52ec829f01c579',
    );
  });

  it('#fetchHttp', async () => {
    const cacheService = new CacheService(new InMemoryCacheStore(), requesterMock);
    const response = await cacheService.fetchHttp('fetch-http')(
      'https://jsonplaceholder.typicode.com/todos', {
        params: { limit: 100 },
      },
    );
    expect(response).toEqual([{ id: 1 }]);
  });
});
