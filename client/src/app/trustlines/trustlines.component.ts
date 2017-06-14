import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable, Tipinfo } from '../global-variable';

@Component({
    selector: 'app-trustlines',
    templateUrl: './trustlines.component.html',
    styleUrls: ['./trustlines.component.css']
})
export class TrustlinesComponent implements OnInit {
    tipinfo: Tipinfo = new Tipinfo();
    loadingTrustline:boolean = false;
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
        this.loadingTrustline = true;
        this.getTrustlines(this.gv.wallet.address);
    }
    getTrustlines(address) {
        this.ripple.getTrustlines(address).subscribe(result => {
            console.log(result);
            this.loadingTrustline = false;
            if (result.ok) {
                this.gv.wallet.trustlines = result.data;
                this.gv.wallet.tradepares = this.ripple.trustline2Tradepairs(result.data);
                console.log(this.gv.wallet.tradepares);
            }
        })
    }
    addTrustline(trustlinestr: string) {
        if (trustlinestr) {
            let pos = trustlinestr.indexOf('.');
            if (pos < 0) {
                this.tipinfo.showWarning("录入的信任格式错误", 3);
                return;
            }
            let currency = trustlinestr.substring(0, pos);
            let counterparty = trustlinestr.substring(pos + 1);
            if (currency.length < 3 || counterparty.length <= 33) {
                this.tipinfo.showWarning("录入的信任格式错误", 3);
                return;
            }
            console.log(currency, counterparty, counterparty.length);
            let address = this.gv.wallet.address;
            let trust = {
                currency: currency,
                counterparty: counterparty,
                limit: "1000000000",
                ripplingDisabled: true,
                frozen: false
            };
            this.ripple.setTrustline(address, trust).subscribe(result => {
                console.log(result);
                if(result.ok){
                    this.loadingTrustline = true;
                    this.tipinfo.showSuccess("增加信任成功",3);
                    setTimeout(()=>{this.getTrustlines(this.gv.wallet.address);},10000);
                }else{
                    this.tipinfo.showDanger(result.data.resultCode + "  " + result.data.resultMessage,6);
                }
            })
        }
    }
}
