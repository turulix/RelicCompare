import { TestBed } from '@angular/core/testing';

import { WarframeMarketService } from './warframe-market.service';

describe('WarframeMarketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WarframeMarketService = TestBed.get(WarframeMarketService);
    expect(service).toBeTruthy();
  });
});
