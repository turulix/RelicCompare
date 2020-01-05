import {Component, OnInit} from '@angular/core';
import {CacheService} from '../../#service/cache.service';

@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

    constructor(private cache: CacheService) {
    }

  ngOnInit() {
  }

}
