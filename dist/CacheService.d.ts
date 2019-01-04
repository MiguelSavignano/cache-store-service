export interface CacheProvider {
    get: (key: string, callback: (error: any, data: any) => void) => void;
    set: (key: string, data: any, typeExpiration?: string, expirationTimeInseconds?: number) => void;
}
export interface RequesterProvider {
    get: (url: string, { params, headers, ...restAxiosOptions }: {
        [x: string]: any;
        params: any;
        headers: any;
    }) => Promise<{
        data: any;
    }>;
}
export declare class CacheService {
    cacheProvider: CacheProvider;
    requester: RequesterProvider;
    constructor(cacheProvider?: CacheProvider, requester?: RequesterProvider);
    fetch(key: string, timeInseconds?: number): (promise: any) => Promise<{}>;
    fetchHttp(keyPrefix: string, timeInseconds?: number): (url: string, { params, headers, ...restAxiosOptions }: {
        [x: string]: any;
        params: any;
        headers: any;
    }) => Promise<{}>;
    generateHttpKey(params?: {}, headers?: {}): string;
}
export default CacheService;
