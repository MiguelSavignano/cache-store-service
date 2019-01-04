import { CacheProvider } from './CacheService';
export declare class InMemoryCacheStore implements CacheProvider {
    store: any;
    constructor(store?: {});
    get(key: string, callback: (error: any, data: any) => void): void;
    set(key: string, data: any, typeExpiration?: string, expirationTimeInseconds?: number): any;
}
export default InMemoryCacheStore;
