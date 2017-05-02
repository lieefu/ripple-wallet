import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletinfoComponent } from './walletinfo.component';

describe('WalletinfoComponent', () => {
  let component: WalletinfoComponent;
  let fixture: ComponentFixture<WalletinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
