import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RelicReward} from '../#classes/relic-reward';
import {Rarity} from '../#enums/rarity.enum';
import {Relic} from '../#classes/relic';
import {State} from '../#enums/state.enum';
import {Tier} from '../#enums/tier.enum';

@Injectable({
    providedIn: 'root'
})
export class RelicService {
    private relics = {};
    private untradeable = [
        'Exilus Weapon Adapter Blueprint',
        '1200X Kuva',
        'Riven Sliver'
    ];

    private specialItems = [
        'Lohk',
        'Xata',
        'Jahu',
        'Vome',
        'Ris',
        'Fass',
        'Netra',
        'Khra'
    ];

    constructor(public http: HttpClient) {
        this.http.get('https://raw.githubusercontent.com/WFCD/warframe-drop-data/gh-pages/data/relics.json').toPromise().then((value: any) => {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < value.relics.length; i++) {
                const relic = value.relics[i];
                const rewardsToUse: RelicReward[] = [];
                for (let j = 0; j < relic.rewards.length; j++) {
                    const rewards = relic.rewards;
                    let reward = null;
                    let tradeable = true;
                    let itemName = rewards[j].itemName;
                    if (this.specialItems.indexOf(rewards[j].itemName) !== -1) {
                        itemName = rewards[j].itemName.toUpperCase();
                    } else if (rewards[j].itemName.match(/.*(Systems|Neuroptics|Chassis) Blueprint/g)) {
                        itemName = rewards[j].itemName.slice(0, rewards[j].itemName.length - ' Blueprint'.length);
                    } else if (rewards[j].itemName.toUpperCase() === 'Ayatan Amber Star'.toUpperCase()) {
                        itemName = 'Amber Ayatan Star';
                    } else if (rewards[j].itemName.toUpperCase() === 'Ayatan Cyan Star'.toUpperCase()) {
                        itemName = 'Cyan Ayatan Star';
                    }
                    for (const item of this.untradeable) {
                        if (itemName.toUpperCase() === item.toUpperCase()) {
                            tradeable = false;
                        }
                    }
                    if (relic.state === State.Intact) {
                        if (rewards[j].chance === 25.33) {
                            reward = new RelicReward(itemName, Rarity.Common, rewards[j].chance, tradeable);
                        } else if (rewards[j].chance === 11) {
                            reward = new RelicReward(itemName, Rarity.Uncommon, rewards[j].chance, tradeable);
                        } else if (rewards[j].chance === 2) {
                            reward = new RelicReward(itemName, Rarity.Rare, rewards[j].chance, tradeable);
                        }
                    } else if (relic.state === State.Exceptional) {
                        if (rewards[j].chance === 23.33) {
                            reward = new RelicReward(itemName, Rarity.Common, rewards[j].chance, tradeable);
                        } else if (rewards[j].chance === 13) {
                            reward = new RelicReward(itemName, Rarity.Uncommon, rewards[j].chance, tradeable);
                        } else if (rewards[j].chance === 4) {
                            reward = new RelicReward(itemName, Rarity.Rare, rewards[j].chance, tradeable);
                        }
                    } else if (relic.state === State.Flawless) {
                        if (rewards[j].chance === 20) {
                            reward = new RelicReward(itemName, Rarity.Common, rewards[j].chance, tradeable);
                        } else if (rewards[j].chance === 17) {
                            reward = new RelicReward(itemName, Rarity.Uncommon, rewards[j].chance, tradeable);
                        } else if (rewards[j].chance === 6) {
                            reward = new RelicReward(itemName, Rarity.Rare, rewards[j].chance, tradeable);
                        }
                    } else if (relic.state === State.Radiant) {
                        if (rewards[j].chance === 16.67) {
                            reward = new RelicReward(itemName, Rarity.Common, rewards[j].chance, tradeable);
                        } else if (rewards[j].chance === 20) {
                            reward = new RelicReward(itemName, Rarity.Uncommon, rewards[j].chance, tradeable);
                        } else if (rewards[j].chance === 10) {
                            reward = new RelicReward(itemName, Rarity.Rare, rewards[j].chance, tradeable);
                        }
                    }
                    rewardsToUse.push(reward);
                }

                this.relics[relic.tier + ' ' + relic.relicName + ' ' + relic.state] = new Relic(Tier[relic.tier as Tier], relic.relicName, State[relic.state as State], rewardsToUse);
            }
        });
    }

    public getRelicByName(name: string): Relic {
        if (this.relics[name] === undefined) {
            return null;
        }
        return this.relics[name];
    }

    public getAllRelicNames(): string[] {
        const keys: string[] = [];
        // tslint:disable-next-line:forin
        for (const key in this.relics) {
            keys.push(key);
        }
        return keys;
    }
}
