import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedwalletCompoent } from './seedwallet.component';

describe('SeedwalletCompoent', () => {
  let component: SeedwalletCompoent;
  let fixture: ComponentFixture<SeedwalletCompoent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeedwalletCompoent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedwalletCompoent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
