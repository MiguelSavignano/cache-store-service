# Cache store service

Simple package for fetch data from cache.

You don't need to get or set the data from cache; if the cache key it's empty set in the cache the result of a promise, if cache it's not empty get the result from cache.

Use Nodejs cache in memory or Redis.

## Install

```
npm install cache-store-service --save
```

## Usage

Save in Nodejs memory

```js
const CacheService = require('cache-store-service')
const cacheService = new CacheService()
const promise = Promise.resolve('data-to-save')
// time in seconds
cacheService.fetch('cache-key-string', 60 * 60)(promise).then( response => {
  console.log(response)
});
// data-to-save
```
#### Save in redis
```js
const Redis = require('ioredis')
const CacheService = require('cache-store-service')
const cacheService = new CacheService(new Redis())
const promise = Promise.resolve('data-to-save')

cacheService.fetch('cache-key-string', 60 * 60)(promise).then( response => {
  console.log(response)
});
// data-to-save
```

#### Example http request
```js
const Redis = require('ioredis')
const axios = require('axios')
const CacheService = require('cache-store-service')
const cacheService = new CacheService(new Redis())
// create custom promise for save the response.data object
const promise = new Promise(resolve => {
  axios.get('https://jsonplaceholder.typicode.com/todos')
    .then(response => resolve(response.data))
  )
})

cacheService.fetch('jsonplaceholder-todos', 60 * 60)(promise).then( response => {
  console.log(response)
});
// [{ "userId": 1, "id": 1}]
```
