import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../../ripple.service';
import { GlobalVariable, Tipinfo } from '../../global-variable';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
    marker: string;//如果条目太多，一次从服务器获取limit限制条数数据，服务器返回marker参数，下次拉取数据提供marker，可以获取余下的数据
    limit: number = 100;
    loading: boolean = false;
    loadingtip: string = "加载历史交易数据";
    trades: Array<Trade>=[];
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }
    ngOnInit() {
        this.getPayments();
    }
    getPayments(){
        this.loading = true;
        this.ripple.getPayments(this.gv.wallet.address, this.marker).subscribe(data => {
            this.loading = false;
            console.log(data);
            if (data.result == "success") {
                this.marker = data.marker;
                let payments=data.payments;
                for(let i=0;i<payments.length;i++){
                    let payment = payments[i];
                    let trade = new Trade();
                    trade.date = payment.executed_time;
                    trade.amount = payment.amount;
                    trade.currency = payment.currency;
                    if(payment.source===this.gv.wallet.address){
                        trade.action="支付";
                        trade.address = payment.destination;
                    }else{
                            trade.action="收到";
                            trade.address = payment.source;
                    }
                    trade.address = this.gv.getAddressAndName(trade.address);
                    this.trades.push(trade);
                }
            }else {
                console.log("getPayments 出错了");
            }
        }, error => {
            this.loading = false;
            console.log("错误发生", error);
        })
    }
    getmoretrade(marker) {
        console.log(marker);
        this.getPayments();
    }
}
class Trade {
    type: string;
    date: Date;
    action: string;
    address: string;//交易对方钱包地址
    amount: string;
    currency:string;
}
