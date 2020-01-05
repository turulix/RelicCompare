import { Component, OnInit } from '@angular/core';
import {RelicService} from '../../#service/relic.service';
import {WarframeMarketService} from '../../#service/warframe-market.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  constructor(private relic: RelicService, private market: WarframeMarketService) {
  }

  ngOnInit() {
  }

}
