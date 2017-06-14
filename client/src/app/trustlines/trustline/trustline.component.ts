import { Component, OnInit, Input } from '@angular/core';
import {RippleService} from '../../ripple.service';
import { GlobalVariable } from '../../global-variable';
@Component({
    selector: 'app-trustline',
    templateUrl: './trustline.component.html',
    styleUrls: ['./trustline.component.css']
})
export class TrustlineComponent implements OnInit {
    @Input()
    trustline: any;
    showedit: boolean = false;
    tipinfo:string;
    limit;
    ripplingDisabled: boolean;
    frozen: boolean;
    constructor(private ripple: RippleService, private gv: GlobalVariable) { }

    ngOnInit() {
        this.limit = this.trustline.specification.limit;
        this.ripplingDisabled = this.trustline.specification.ripplingDisabled;
        this.frozen = this.trustline.specification.frozen;
    }
    delete(){
        this.tipinfo="删除方法：余额清零(把全部余额转账/付款到信任地址)，然后设置信任限额为0";
    }
    save() {
        console.log(this.limit, this.ripplingDisabled, this.frozen);
        let address = this.gv.wallet.address;
        let trust={
            currency:this.trustline.specification.currency,
            counterparty:this.trustline.specification.counterparty,
            limit:this.limit,
            ripplingDisabled:this.ripplingDisabled,
            frozen:this.frozen
        };
        this.tipinfo = "";
        this.ripple.setTrustline(address,trust).subscribe(result =>{
            console.log(result);
            this.tipinfo = result.data.resultCode +"  "+result.data.resultMessage;
        })
    }
}
