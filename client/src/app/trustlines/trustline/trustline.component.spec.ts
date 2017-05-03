import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustlineComponent } from './trustline.component';

describe('TrustlineComponent', () => {
  let component: TrustlineComponent;
  let fixture: ComponentFixture<TrustlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
