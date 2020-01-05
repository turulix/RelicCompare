import {Component, OnInit} from '@angular/core';
import {RelicService} from '../../../#service/relic.service';
import {Relic} from '../../../#classes/relic';
import {Rarity} from '../../../#enums/rarity.enum';
import {WarframeMarketService} from '../../../#service/warframe-market.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
    public input = '';
    public focused = false;
    public rarity = Rarity;

    public selectedIndex = -1;
    public selected = '';

    public selectedRelic: Relic;
    public rewards;

    relics: string[] = [];

    constructor(private relicService: RelicService, private market: WarframeMarketService) {
    }

    ngOnInit() {
    }

    async select(name: string) {
        this.selectedRelic = this.relicService.getRelicByName(name);
        if (this.selectedRelic === null) {
            this.rewards = [];
            return;
        }
        const rewards = [];

        for (const reward of this.selectedRelic.rewards) {
            this.market.getMedianPrice48(this.market.getItemUrl(reward.itemName)).then(value => {
                rewards.push({
                    itemName: reward.itemName,
                    rarity: reward.rarity,
                    tradeable: reward.tradeable,
                    chance: reward.chance,
                    price: value,
                    urlName: this.market.getItemUrl(reward.itemName)
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

    click(value: string) {
        this.input = value;
        this.getRelicOptions(value);
        this.select(value).then(_ => {
        });
    }

    onSearchChange(searchValue: string): void {
        this.input = searchValue;
        this.selectedIndex = -1;
        this.selected = '';
        this.select(searchValue).then(_ => {
        });
        this.getRelicOptions(searchValue);
    }

    getRelicOptions(searchValue: string) {
        if (searchValue === '') {
            this.relics = [];
            this.rewards = [];
            this.unFocus();
        }
        const relics = this.relicService.getAllRelicNames().sort().filter(value => value.toLowerCase().includes(searchValue.toLowerCase())).slice(0, 6);
        if (relics.length === 0) {
            this.unFocus();
            return;
        }
        this.focus();
        this.relics = relics;
    }

    unFocus() {
        setTimeout(args => {
            this.focused = false;
            this.selectedIndex = -1;
            this.selected = '';
        }, 130);
    }

    focus() {
        if (this.input === '') {
            this.selectedRelic = undefined;
            this.selectedIndex = -1;
            this.selected = '';
            return;
        }
        this.focused = true;
    }

    arrowDown() {
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

    arrowUp() {
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

    enter() {
        if (!this.focused) {
            return;
        }
        if (this.selected === '') {
            return;
        }
        this.select(this.selected).then(_ => {
        });
        this.unFocus();
    }
}
