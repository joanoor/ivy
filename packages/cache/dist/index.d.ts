interface EncryptionParams {
    key: string;
    iv: string;
}
declare class AesEncryption {
    private key;
    private iv;
    constructor(opt?: Partial<EncryptionParams>);
    encryptByAES(cipherText: string): string;
    decryptByAES(cipherText: string): string;
}

interface CreateStorageParams extends EncryptionParams {
    prefixKey: string;
    storage: Storage;
    hasEncrypt: boolean;
    timeout?: Nullable<number>;
}
interface Cache$1<T = any> {
    value?: T;
    timeoutId?: ReturnType<typeof setTimeout>;
    time?: number;
    alive?: number;
}
type Options = Omit<Partial<CreateStorageParams>, 'storage'>;

interface WebStorageCon extends Omit<CreateStorageParams, 'key' | 'iv'> {
    encryption: AesEncryption;
}
declare class WebStorage {
    private storage;
    private encryption;
    private hasEncrypt;
    private prefixKey?;
    private timeout;
    constructor({ storage, prefixKey, encryption, hasEncrypt, timeout, }: WebStorageCon);
    private getKey;
    set(key: string, value: any, expire?: number | null): void;
    get(key: string, def?: any): any;
    remove(key: string): void;
    clear(): void;
}

declare const createSessionStorage: (options?: Options) => WebStorage;
declare const createLocalStorage: (options?: Options) => WebStorage;

interface Cache<T = any> {
    value?: T;
    timeoutId?: ReturnType<typeof setTimeout>;
    time?: number;
    alive?: number;
}
declare class Memory<T = any, V = any> {
    private cache;
    private alive;
    constructor(alive?: number);
    get getCache(): { [key in keyof T]?: Cache<V> | undefined; };
    setCache(cache: Recordable): void;
    get<K extends keyof T>(key: K): { [key in keyof T]?: Cache<V> | undefined; }[K];
    set<K extends keyof T>(key: K, value: V, expires?: number): V;
    remove<K extends keyof T>(key: K): V | undefined;
    resetCache(cache: {
        [K in keyof T]: Cache;
    }): void;
    clear(): void;
}

declare const defaultCacheCipher: {
    key: string;
    iv: string;
};
declare const DEFAULT_CACHE_TIME: number;

export { Cache$1 as Cache, CreateStorageParams, DEFAULT_CACHE_TIME, Memory, Options, createLocalStorage, createSessionStorage, defaultCacheCipher };
