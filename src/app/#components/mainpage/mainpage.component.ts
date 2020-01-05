import {Component, OnInit} from '@angular/core';
import {CacheService} from '../../#service/cache.service';
import {Tier} from '../../#enums/tier.enum';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {
    Arr = Array;
    tier = Tier;
    private selected = new BehaviorSubject<Tier>(Tier.None);

    constructor(private cache: CacheService) {
    }

    ngOnInit() {
    }
}
