import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainwalletComponent } from './brainwallet.component';

describe('BrainwalletComponent', () => {
  let component: BrainwalletComponent;
  let fixture: ComponentFixture<BrainwalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrainwalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrainwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
