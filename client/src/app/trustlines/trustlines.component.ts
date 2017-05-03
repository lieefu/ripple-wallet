import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';

@Component({
    selector: 'app-trustlines',
    templateUrl: './trustlines.component.html',
    styleUrls: ['./trustlines.component.css']
})
export class TrustlinesComponent implements OnInit {

    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
        this.getTrustlines(this.gv.wallet.address);
    }
    getTrustlines(address){
        this.ripple.getTrustlines(address).subscribe(result =>{
            console.log(result);
            if(result.ok){
                this.gv.wallet.trustlines=result.data;
            }
        })
    }
}
