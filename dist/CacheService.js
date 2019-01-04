"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha1 = require('sha1');
const InMemoryCacheStore_1 = require("./InMemoryCacheStore");
class CacheService {
    constructor(cacheProvider = new InMemoryCacheStore_1.default(), requester) {
        this.cacheProvider = cacheProvider;
        this.requester = requester;
    }
    fetch(key, timeInseconds) {
        return promise => new Promise((resolve, reject) => {
            this.cacheProvider.get(key, (err, dataRedis) => {
                if (err || !dataRedis) {
                    promise
                        .then(data => {
                        if (timeInseconds) {
                            this.cacheProvider.set(key, JSON.stringify(data), 'EX', timeInseconds);
                        }
                        else {
                            this.cacheProvider.set(key, JSON.stringify(data));
                        }
                        resolve(data);
                    })
                        .catch(reject);
                }
                else {
                    resolve(JSON.parse(dataRedis));
                }
            });
        });
    }
    fetchHttp(keyPrefix, timeInseconds) {
        return (url, _a) => {
            var { params, headers } = _a, restAxiosOptions = __rest(_a, ["params", "headers"]);
            const key = this.generateHttpKey(Object.assign({}, params), Object.assign({}, headers));
            const promise = new Promise((resolve, reject) => {
                this.requester
                    .get(url, Object.assign({ params, headers }, restAxiosOptions))
                    .then(response => {
                    resolve(response.data);
                })
                    .catch(reject);
            });
            return this.fetch(`${keyPrefix}-${key}`, timeInseconds)(promise);
        };
    }
    generateHttpKey(params = {}, headers = {}) {
        return `${sha1(JSON.stringify(Object.assign({}, params, headers)))}`;
    }
}
exports.CacheService = CacheService;
exports.default = CacheService;
