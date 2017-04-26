import { Component, OnInit } from '@angular/core';
import {RippleService} from '../ripple.service';
@Component({
    selector: 'app-createwallet',
    templateUrl: './createwallet.component.html',
    styleUrls: ['./createwallet.component.css']
})
export class CreatewalletComponent implements OnInit {
    wallet;
    constructor(private ripple: RippleService) {
    }

    ngOnInit() {
    }
    createWallet(){
        this.ripple.createWallet().subscribe(wallet => this.wallet=wallet);
    }
}
