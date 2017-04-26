import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatewalletComponent } from './privatewallet.component';

describe('PrivatewalletComponent', () => {
  let component: PrivatewalletComponent;
  let fixture: ComponentFixture<PrivatewalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivatewalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivatewalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
