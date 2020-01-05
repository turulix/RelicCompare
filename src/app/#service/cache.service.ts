import {Injectable} from '@angular/core';
import Dexie from 'dexie';

export class CacheEntry {
    public readonly key: string;
    public readonly expiryDate: Date;
    public readonly value: any;

    constructor(key: string, expiryDate: Date, value: any) {
        this.key = key;
        this.expiryDate = expiryDate;
        this.value = value;
    }
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    // tslint:disable-next-line:variable-name
    private _cache: Map<string, CacheEntry> = new Map<string, CacheEntry>();
    private db = null;

    constructor() {
        console.log('Cache Service');
        this.db = new Dexie('Cache');
        this.db.version(1).stores({
            cache: '&key'
        });

        this.db.open('Cache').then(db => {
            db.cache.each(async entry => {
                this._cache.set(entry.key, new CacheEntry(entry.key, entry.expire, entry.value));
            });
        });
    }

    public async get(key: string): Promise<CacheEntry> {
        if (!this._cache.has(key)) {
            return null;
        }
        const entry = this._cache.get(key);
        if (entry.expiryDate.getTime() < new Date().getTime()) {
            return null;
        }
        return entry;
    }

    public async set(entry: CacheEntry) {
        this._cache.set(entry.key, entry);
        const db = await this.db.open();
        await db.cache.put({key: entry.key, expire: entry.expiryDate, value: entry.value});
    }

    public async add(key: string, expireIn: number, value: any) {
        const expiryDate = new Date(new Date().getTime() + (1000) * expireIn);
        await this.set(new CacheEntry(key, expiryDate, value));
    }

    public async has(key: string): Promise<boolean> {
        if (this._cache.has(key)) {
            if (await this.get(key) === null) {
                this._cache.delete(key);
                return false;
            }
            return true;
        }
        return false;
    }

}
