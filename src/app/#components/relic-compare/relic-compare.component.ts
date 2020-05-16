import {Component, OnInit} from '@angular/core';
import {CacheService} from '../../#service/cache.service';
import {Tier} from '../../#enums/tier.enum';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-mainpage',
    templateUrl: './relic-compare.component.html',
    styleUrls: ['./relic-compare.component.scss']
})
export class RelicCompareComponent implements OnInit {
    Arr = Array;
    tier = Tier;
    public selected = new BehaviorSubject<Tier>(Tier.None);

    constructor(private cache: CacheService) {
    }

    ngOnInit() {
    }
}
