import { TestBed } from '@angular/core/testing';

import { RelicService } from './relic.service';

describe('RelicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelicService = TestBed.get(RelicService);
    expect(service).toBeTruthy();
  });
});
