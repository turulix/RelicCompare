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
    private db = null;

    constructor() {
        console.log('Cache Service');
        this.db = new Dexie('Cache');
        this.db.version(1).stores({
            cache: '&key'
        });
    }

    public async get(key: string): Promise<CacheEntry> {
        const db = await this.db.open();
        let entry = await db.cache.get(key);
        if (entry === undefined) {
            return undefined;
        }
        entry = new CacheEntry(entry.key, entry.expire, entry.value);
        if (entry.expiryDate.getTime() < new Date().getTime()) {
            return undefined;
        }
        return entry;
    }

    public async set(entry: CacheEntry) {
        const db = await this.db.open();
        await db.cache.put({key: entry.key, expire: entry.expiryDate, value: entry.value});
    }

    public async add(key: string, expireIn: number, value: any) {
        const expiryDate = new Date(new Date().getTime() + (1000) * expireIn);
        await this.set(new CacheEntry(key, expiryDate, value));
    }

    public async has(key: string): Promise<boolean> {
        return (await this.get(key)) !== undefined;
    }

}
