import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../../ripple.service';
import { GlobalVariable } from '../../global-variable';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
    title:string = "正在链接Ripple网络，请稍后...";
    accountinfo:any;
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }
    ngOnInit() {
        console.log(this.gv.wallet);
        if(!this.gv.wallet){
            //都无法跳转到首页
            //console.log("no wallet");
            //this.router.navigateByUrl('');
            this.router.navigate(['']);
            return;
        }
        this.ripple.accountinfo(this.gv.wallet.address).subscribe(result =>{
            if(result.ok){
                this.title = "正在加载资金余额信息，请稍后......";
                this.accountinfo = this.gv.wallet.accountinfo= result.data;
                this.getBalances(this.gv.wallet.address);
            }else{
                if(result.data == "TimeoutError"){
                    this.title="链接Ripple网络超时，请稍后再试！";
                }else{
                    this.title="该钱包未激活，请激活后使用";
                }
                console.log(result);
            }
        })
    }
    getBalances(address){
        this.ripple.getBalances(address).subscribe(result =>{
            console.log(result);
            if(result.ok){
                this.title = "资金状况";
                this.gv.wallet.balances = result.data;
                console.log(this.gv.wallet.balances);
            }
        })
    }
}
