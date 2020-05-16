import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelicCompareComponent } from './relic-compare.component';

describe('MainpageComponent', () => {
  let component: RelicCompareComponent;
  let fixture: ComponentFixture<RelicCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelicCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelicCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
