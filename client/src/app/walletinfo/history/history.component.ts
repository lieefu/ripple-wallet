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
    marker:string;
    limit:number=100;
    loading:boolean=false;
    loadingtip:string="加载历史交易数据";
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
        this.loading = true;
        this.ripple.getTransactions(this.gv.wallet.address,"Payment").subscribe(data =>{
            this.loading = false;
            console.log(data);
            if(data.result=="success"){
                this.marker=data.marker;
            }else{
                console.log("getTransactions 出错了");
            }
        },error =>{
            this.loading = false;
            console.log("错误发生",error);
        })
    }

}
