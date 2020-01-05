import {Tier} from '../#enums/tier.enum';
import {State} from '../#enums/state.enum';
import {RelicReward} from './relic-reward';

export class Relic {
    public readonly tier: Tier;
    public readonly relicName: string;
    public readonly state: State;
    public readonly rewards: RelicReward[];


    constructor(tier: Tier, relicName: string, state: State, rewards: RelicReward[]) {
        this.tier = tier;
        this.relicName = relicName;
        this.state = state;
        this.rewards = rewards;
    }
}
