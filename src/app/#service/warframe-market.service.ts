import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CacheService} from './cache.service';

@Injectable({
    providedIn: 'root'
})
export class WarframeMarketService {
    private key = 'https://api.warframe.market/v1/items';
    private items = null;

    constructor(private http: HttpClient, private cacheService: CacheService) {
    }

    public async getMedianPrice48(name: string): Promise<string> {
        if (name === null) {
            return 'None';
        }
        if (!await this.cacheService.has(this.key) || this.items === null) {
            await this.initData();
        }
        const url = `https://api.warframe.market/v1/items/${name}/statistics`;
        if (await this.cacheService.has(url)) {
            console.log('Cached: ' + url);
            return (await this.cacheService.get(url)).value as string;
        }
        const res: any = await this.proxyRequest(url);
        if (res.payload.statistics_closed['48hours'][res.payload.statistics_closed['48hours'].length - 1] === undefined) {
            return 'None';
        }
        const value = res.payload.statistics_closed['48hours'][res.payload.statistics_closed['48hours'].length - 1].median;
        await this.cacheService.add(url, 60 * 60, value);
        return value;
    }

    public async getIcon(name: string): Promise<string> {
        if (!await this.cacheService.has(this.key) || this.items === null) {
            await this.initData();
        }
        const url = `https://api.warframe.market/v1/items/${name}`;
        if (await this.cacheService.has(url)) {
            return (await this.cacheService.get(url)).value as string;
        }
        const res: any = await this.proxyRequest(url);
        const value = `https://warframe.market/static/assets/${res.payload.item.items_in_set[0].icon}`;
        await this.cacheService.add(value, 60 * 60, value);
        return value;
    }

    public async getItemUrl(name: string): Promise<string> {
        if (!await this.cacheService.has(this.key) || this.items === null) {
            await this.initData();
        }
        if (this.items[name] === undefined) {
            return null;
        }
        return this.items[name];
    }

    public async proxyRequest(url: string): Promise<any> {
        console.log('Downloading: ' + url);
        return await this.http.get(`https://api.allorigins.win/raw?url=` + url).toPromise() as Promise<any>;
    }

    private async initData() {
        this.items = {};
        if (await this.cacheService.has(this.key)) {
            for (const item of (await this.cacheService.get(this.key)).value.payload.items) {
                this.items[item.item_name] = item.url_name;
            }
            console.log('Cached: ' + this.key);
            return;
        }
        const res: any = await this.proxyRequest('https://api.warframe.market/v1/items');
        await this.cacheService.add(this.key, 60 * 60, res);
        await this.initData();
    }
}
