import {Rarity} from '../#enums/rarity.enum';

export class RelicReward {
    public readonly itemName: string;
    public readonly rarity: Rarity;
    public readonly chance: number;
    public readonly tradeable: boolean;

    constructor(itemName: string, rarity: Rarity, chance: number, tradeable: boolean) {
        this.itemName = itemName;
        this.rarity = rarity;
        this.chance = chance;
        this.tradeable = tradeable;
    }
}
