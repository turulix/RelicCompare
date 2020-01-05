import {Component, Input, OnInit} from '@angular/core';
import {RelicService} from '../../../#service/relic.service';
import {Relic} from '../../../#classes/relic';
import {Rarity} from '../../../#enums/rarity.enum';
import {WarframeMarketService} from '../../../#service/warframe-market.service';
import {Tier} from '../../../#enums/tier.enum';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
    public input = '';
    public focused = false;
    public rarity = Rarity;

    @Input() selectedTier: BehaviorSubject<Tier>;
    public selectedIndex = -1;
    public selected = '';

    public selectedRelic: Relic;
    public rewards;

    relics: string[] = [];

    constructor(private relicService: RelicService, private market: WarframeMarketService) {
    }

    async ngOnInit() {
        this.selectedTier.subscribe(async value => {
            this.input = '';
            await this.select('');
        });
    }

    async select(name: string) {
        this.selectedRelic = await this.relicService.getRelicByName(name);
        if (this.selectedRelic === null || this.selectedRelic === undefined) {
            this.rewards = [];
            return;
        }
        const rewards = [];
        for (const reward of this.selectedRelic.rewards) {
            this.market.getMedianPrice48(await this.market.getItemUrl(reward.itemName)).then(async value => {
                rewards.push({
                    itemName: reward.itemName,
                    rarity: reward.rarity,
                    tradeable: reward.tradeable,
                    chance: reward.chance,
                    price: value,
                    urlName: await this.market.getItemUrl(reward.itemName)
                });
                rewards.sort((a, b) => {
                    if (a.rarity === Rarity.Rare && b.rarity !== Rarity.Rare) {
                        return 1;
                    }
                    if (a.rarity === Rarity.Uncommon && b.rarity === Rarity.Rare) {
                        return -1;
                    }
                    if (a.rarity === Rarity.Common && b.rarity === Rarity.Rare || b.rarity === Rarity.Uncommon) {
                        return -1;
                    }
                    return 0;
                });
                rewards.sort((a, b) => {
                    if (a.rarity === b.rarity) {
                        if (a.itemName < b.itemName) {
                            return 1;
                        }
                        if (a.itemName > b.itemName) {
                            return -1;
                        }
                        return 0;
                    }
                }).reverse();
            });
        }


        this.rewards = rewards;
    }

    async click(value: string) {
        this.input = value;
        this.getRelicOptions(value);
        await this.select(value);
    }

    async onSearchChange(searchValue: string) {
        this.input = searchValue;
        this.selectedIndex = -1;
        this.selected = '';
        await this.select(searchValue);
        this.getRelicOptions(searchValue);
    }

    async getRelicOptions(searchValue: string) {
        if (searchValue === '') {
            this.relics = [];
            this.rewards = [];
            this.unFocus();
        }
        const relics = (await this.relicService.getAllRelicNames()).sort().filter(value => {
            if (this.selectedTier.getValue() === Tier.None) {
                return value.toLowerCase().includes(searchValue.toLowerCase());
            } else {
                return value.toLowerCase().includes(this.selectedTier.getValue().toLowerCase() + ' ' + searchValue.toLowerCase());
            }
        }).slice(0, 6);
        if (relics.length === 0) {
            this.unFocus();
            return;
        }
        this.focus();
        this.relics = relics;
    }

    async unFocus() {
        setTimeout(args => {
            this.focused = false;
            this.selectedIndex = -1;
            this.selected = '';
        }, 130);
    }

    async focus() {
        if (this.input === '') {
            this.selectedRelic = undefined;
            this.selectedIndex = -1;
            this.selected = '';
            return;
        }
        this.focused = true;
    }

    async arrowDown() {
        if (!this.focused) {
            return;
        }
        if (this.selectedIndex + 1 === this.relics.length) {
            return;
        }
        this.selectedIndex += 1;
        this.selected = this.relics[this.selectedIndex];
        this.input = this.selected;
    }

    async arrowUp() {
        if (!this.focused) {
            return;
        }
        if (this.selectedIndex - 1 === -2) {
            return;
        }
        this.selectedIndex--;
        this.selected = this.relics[this.selectedIndex];
        this.input = this.selected;
    }

    async enter() {
        if (!this.focused) {
            return;
        }
        if (this.relics.length === 4) {
            await this.select(this.relics[0]);
            this.input = this.relics[0];
            this.unFocus();
        }
        if (this.selected === '') {
            return;
        }

        await this.select(this.selected);
        this.unFocus();
    }
}
