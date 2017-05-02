import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecryptwalletComponent } from './decryptwallet.component';

describe('DecryptwalletComponent', () => {
  let component: DecryptwalletComponent;
  let fixture: ComponentFixture<DecryptwalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecryptwalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecryptwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
