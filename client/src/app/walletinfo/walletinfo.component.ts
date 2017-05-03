import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';

@Component({
    selector: 'app-walletinfo',
    templateUrl: './walletinfo.component.html',
    styleUrls: ['./walletinfo.component.css']
})
export class WalletinfoComponent implements OnInit {
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }
    ngOnInit() {}
}
