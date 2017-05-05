import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';
@Component({
    selector: 'app-seedwallet',
    templateUrl: './seedwallet.component.html',
    styleUrls: ['./seedwallet.component.css']
})
export class SeedwalletCompoent implements OnInit {
    tipinfo:string;
    wallet:any;
    seed:string;
    isSave:boolean=false;
    constructor(private ripple: RippleService,private gv:GlobalVariable,private router:Router) { }

    ngOnInit() {
    }
    importWallet(){
        this.tipinfo="正在验证私钥...........";
        this.isSave=false;
        this.router.navigate(['/createwallet/seedwallet']);
        this.ripple.importWallet(this.seed).subscribe(result => {
            if(result.ok){
                this.wallet=result.data;
                this.tipinfo = "导入私钥成功！接下来你应该点击保存按钮，保存这个钱包。";
            }else{
                this.tipinfo = result.data;
            }
        });
    }
    saveWallet(){
        this.ripple.saveWallet().subscribe(result=>{
            if(result.ok){
                this.isSave=true;
                this.gv.wallet=result.data;
                this.tipinfo="钱包已经保存成功，接下来你应该点击加密钱包按钮，输入钱包口令，加密这个钱包。";
            }else{
                this.isSave=false;
                this.tipinfo=result.data;
            }
        });
    }
}
