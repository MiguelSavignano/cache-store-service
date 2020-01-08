"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InMemoryCacheStore {
    constructor(store = {}) {
        this.store = store;
    }
    get(key, callback) {
        callback(null, this.store[key]);
    }
    set(key, data, typeExpiration, expirationTimeInseconds) {
        if (typeExpiration === "EX") {
            expirationTimeInseconds = expirationTimeInseconds || 1000 * 60;
            this.store[key] = data;
            setTimeout(() => {
                delete this.store[key];
            }, expirationTimeInseconds);
            return data;
        }
        else {
            this.store[key] = data;
            return data;
        }
    }
}
exports.InMemoryCacheStore = InMemoryCacheStore;
exports.default = InMemoryCacheStore;
