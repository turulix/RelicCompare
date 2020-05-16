import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelicSearchBarComponent } from './relic-search-bar.component';

describe('SearchBarComponent', () => {
  let component: RelicSearchBarComponent;
  let fixture: ComponentFixture<RelicSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelicSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelicSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
