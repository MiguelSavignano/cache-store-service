export interface ICacheProvider {
    get: (key: string, callback: (error: any, data: any) => void) => void;
    set: (key: string, data: any, typeExpiration?: string, expirationTimeInseconds?: number) => void;
}
export interface IRequesterProvider {
    get: (url: string, { params, headers, ...restAxiosOptions }: {
        [x: string]: any;
        params: any;
        headers: any;
    }) => Promise<{
        data: any;
    }>;
}
export declare class CacheService {
    cacheProvider: ICacheProvider;
    requester: IRequesterProvider;
    constructor(cacheProvider?: ICacheProvider, requester?: IRequesterProvider);
    fetch(key: string, timeInseconds?: number): (promise: any) => Promise<{}>;
    fetchHttp(keyPrefix: string, timeInseconds?: number): (url: string, { params, headers, ...restAxiosOptions }: any) => Promise<{}>;
    generateHttpKey(params?: {}, headers?: {}): string;
}
export default CacheService;
