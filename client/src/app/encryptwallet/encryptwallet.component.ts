import { Component, OnInit } from '@angular/core';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';
@Component({
    selector: 'app-encryptwallet',
    templateUrl: './encryptwallet.component.html',
    styleUrls: ['./encryptwallet.component.css']
})
export class EncryptwalletComponent implements OnInit {
    tipinfo:string;
    password0:string;
    password1:string;
    constructor(private ripple: RippleService,private gv:GlobalVariable) { }

    ngOnInit() {
    }
    encryptWallet(){
        console.log(this.gv.wallet,this.password0,this.password1,this.password0===this.password1);
        if(!this.password0){
            this.tipinfo="口令不能为空";
            return;
        }
        if(this.password0===this.password1){
            this.ripple.encryptWallet(this.gv.wallet.address,this.password0).subscribe(result=>{
                if(result.ok){
                    console.log(result);
                    this.gv.wallet = result.data;
                    this.tipinfo = "钱包文件加密成功";
                }else{
                    this.tipinfo = result.data;
                }
            });
        }else{
            this.tipinfo="口令不一致";
        }
    }
}
