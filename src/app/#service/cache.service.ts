import {Injectable} from '@angular/core';


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
    providedIn: "root"
})
export class CacheService {
    // tslint:disable-next-line:variable-name
    private _cache: Map<string, CacheEntry> = new Map<string, CacheEntry>();

    public get(key: string): CacheEntry {
        if (!this._cache.has(key)) {
            return null;
        }
        const entry = this._cache.get(key);
        if (entry.expiryDate.getTime() < new Date().getTime()) {
            this.remove(key);
            return null;
        }
        return entry;
    }

    public set(entry: CacheEntry) {
        this._cache.set(entry.key, entry);
    }

    public add(key: string, expireIn: number, value: any) {
        this._cache.set(key, new CacheEntry(key, new Date(new Date().getTime() + (1000) * expireIn), value));
    }

    public has(key: string): boolean {
        if (this._cache.has(key)) {
            if (this.get(key) === null) {
                this.remove(key);
                return false;
            }
            return true;
        }
        return false;
    }

    public remove(key: string) {
        this._cache.delete(key);
    }
}
