import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CacheService} from './cache.service';

@Injectable({
    providedIn: 'root'
})
export class WarframeMarketService {

    private readonly items = {};

    constructor(public http: HttpClient, public cacheService: CacheService) {
        this.proxyRequest('https://api.warframe.market/v1/items').then((value) => {
            for (const item of value.payload.items) {
                this.items[item.item_name] = item.url_name;
            }
        });
    }

    public async getMedianPrice48(name: string): Promise<string> {
        if (name === null) {
            return 'None';
        }
        const url = `https://api.warframe.market/v1/items/${name}/statistics`;
        if (this.cacheService.has(url)) {
            console.log('Returning cached entry for ' + name);
            return this.cacheService.get(url).value as string;
        }
        console.log('Requesting stats for ' + name + ' from warframe.market');
        const res: any = await this.proxyRequest(url);
        if (res.payload.statistics_closed['48hours'][res.payload.statistics_closed['48hours'].length - 1] === undefined) {
            return 'None';
        }
        const value = res.payload.statistics_closed['48hours'][res.payload.statistics_closed['48hours'].length - 1].median;
        this.cacheService.add(url, 60 * 60, value);
        return value;
    }

    public async getIcon(name: string): Promise<string> {
        const url = `https://api.warframe.market/v1/items/${name}`;
        if (this.cacheService.has(url)) {
            return this.cacheService.get(url).value as string;
        }
        const res: any = await this.proxyRequest(url);
        const value = `https://warframe.market/static/assets/${res.payload.item.items_in_set[0].icon}`;
        this.cacheService.add(value, 60 * 60, value);
        return value;
    }

    public getItemUrl(name: string): string {
        if (this.items[name] === undefined) {
            return null;
        }
        return this.items[name];
    }

    public async proxyRequest(url: string): Promise<any> {
        return await this.http.get(`https://api.allorigins.win/raw?url=` + url).toPromise() as Promise<any>;
    }
}
