import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from './global-variable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
    constructor(private gv:GlobalVariable) {
    }
    ngOnInit() {}
}
