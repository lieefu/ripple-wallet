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
    isCollapsed:boolean=true;
    accountinfo:any;
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }
    ngOnInit() {
        this.ripple.accountinfo(this.gv.wallet.address).subscribe(result =>{
            console.log(result);
            if(result.ok){
                this.accountinfo = result.data;
            }
        })
    }

}
