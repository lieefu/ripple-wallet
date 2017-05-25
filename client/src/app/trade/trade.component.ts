import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';

@Component({
    selector: 'app-trade',
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
        let orderbook = {
            base: {
                "currency": "XRP",
            },
            counter: {
                "currency": "CNY",
                "counterparty": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y"
            }
        }
        this.ripple.getOrderbook("rEp4SYVfwQgGbWCJV4tBAgGNpG2KeiaY1W",orderbook,20).subscribe(result=>{
            console.log(result);
        })
    }

}
