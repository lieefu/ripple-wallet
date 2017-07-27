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
    title:string = "资金状况";
    loadingtip:string;
    accountinfo:any;
    loadingBalance:boolean = false;
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
        this.ripple.getdata().subscribe(result => {
            console.log(result);
            if (result.ok) {
                this.gv.data.contacts = result.data.contacts;
                this.gv.data.tradepare = result.data.tradepare||{};
            }
        })
        this.loadingtip = "正在链接Ripple网络，请稍后...";
        this.loadingBalance = true;
        this.ripple.accountinfo(this.gv.wallet.address).subscribe(result =>{
            this.loadingBalance = false;
            if(result.ok){
                //this.title = "正在加载资金余额信息，请稍后......";
                this.gv.walletIsActive = true;
                this.accountinfo = this.gv.wallet.accountinfo= result.data;
                this.getBalances(this.gv.wallet.address);
            }else{
                if(result.data.name == "TimeoutError" || result.data.name=="NotConnectedError"){
                    this.title="链接Ripple网络超时，请稍后再试！" ;
                }else{
                    this.title="该钱包未激活，请激活后使用";
                }
                console.log(result);
            }
        })
    }
    getBalances(address){
        this.loadingtip = "正在加载钱包内资金数据..."
        this.loadingBalance = true;
        this.ripple.getBalances(address).subscribe(result =>{
            console.log(result);
            if(result.ok){
                this.loadingBalance = false;
                this.title = "";
                this.gv.wallet.balances = result.data;
                console.log(this.gv.wallet.balances);
            }else{
                this.title = result.data;
            }
        })
    }
}
