import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variable';
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(private gv:GlobalVariable) { }

  ngOnInit() {
  }

}
