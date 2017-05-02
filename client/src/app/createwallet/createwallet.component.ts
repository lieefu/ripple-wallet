import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variable';
@Component({
  selector: 'app-createwallet',
  templateUrl: './createwallet.component.html',
  styleUrls: ['./createwallet.component.css']
})
export class CreatewalletComponent implements OnInit {

  constructor(private gv:GlobalVariable) { }

  ngOnInit() {
  }

}
