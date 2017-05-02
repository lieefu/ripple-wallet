import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';
@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
    tipinfo:string;
    addresses:Array<string>;
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
        this.ripple.getWallets().subscribe(result =>{
            this.addresses = result.data;
            console.log(result);
        })
    }
    openWallet(address){
        console.log(address);
        this.ripple.getWallet(address).subscribe(result => {
            console.log(result);
            if(result.ok){
                this.gv.wallet= result.data;
                if(this.gv.wallet.isSecreted){
                    this.router.navigate(['decryptwallet']);
                }else{
                    this.router.navigate(['walletinfo']);
                }
            }else{
                this.tipinfo = result.data;
            }
        })
    }
    createWallet(){
        this.router.navigate(['createwallet']);
    }
}
