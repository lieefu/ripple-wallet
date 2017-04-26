import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptwalletComponent } from './encryptwallet.component';

describe('EncryptwalletComponent', () => {
  let component: EncryptwalletComponent;
  let fixture: ComponentFixture<EncryptwalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncryptwalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
