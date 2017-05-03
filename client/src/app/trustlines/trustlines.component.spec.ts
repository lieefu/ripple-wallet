import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustlinesComponent } from './trustlines.component';

describe('TrustlinesComponent', () => {
  let component: TrustlinesComponent;
  let fixture: ComponentFixture<TrustlinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustlinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
