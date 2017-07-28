import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RippleService } from '../ripple.service';
import { GlobalVariable, Tipinfo } from '../global-variable';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
    isRipplefox:boolean=false;
    isRipplechina:boolean=false;
    isNoGateway:boolean=false;
    tipinfo: Tipinfo = new Tipinfo();
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
        if (this.gv.wallet.trustlines) {
            this.init();
        } else {
            this.getTrustlines(this.gv.wallet.address);
        }
    }
    init() {
        for(let i=0;i<this.gv.wallet.trustlines.length;i++){
            let trustline=this.gv.wallet.trustlines[i];
            if(trustline.specification.counterparty==="rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y"){
                this.isRipplefox=true;
            }
            if(trustline.specification.counterparty==="razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA"){
                this.isRipplechina=true;
            }
        }
        this.isNoGateway = !this.isRipplefox&&!this.isRipplechina;
    }
    getTrustlines(address) {
        this.ripple.getTrustlines(address).subscribe(result => {
            console.log(result);
            if (result.ok) {
                this.gv.wallet.trustlines = result.data;
                this.gv.wallet.tradepares = this.ripple.trustline2Tradepairs(result.data);
                this.init();
            }
        })
    }
    setGateway(gateway:string){
        let address = this.gv.wallet.address;
        let trust = {
            currency: "CNY",
            counterparty: gateway,
            limit: "1000000000",
            ripplingDisabled: true,
            frozen: false
        };
        this.ripple.setTrustline(address, trust).subscribe(result => {
            console.log(result);
            if(result.ok){
                this.tipinfo.showSuccess("增加网关交易市场成功",3);
                setTimeout(()=>{this.getTrustlines(this.gv.wallet.address);},10000);
            }else{
                this.tipinfo.showDanger("增加网关交易市场失败："+result.data.resultCode + "  " + result.data.resultMessage,6);
            }
        })
    }
}
