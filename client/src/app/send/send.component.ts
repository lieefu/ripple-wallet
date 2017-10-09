import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {
    timer;
    destination_tag:string;
    memo:string;
    invoiceID:string;
    showTag:boolean=false;
    showTagInfo:string ="+";
    showloading:boolean = false;
    loading:string;
    tipinfo: string;
    tipinfo_path:string;
    tipinfo_payment:string;
    recipient_label: string;
    currency_label: string = "XRP- Ripples";
    Amount: any = {
        currency: "XRP",
        value: 0
    };
    destination_address: string;
    amount_value: number;
    pathfind: any;
    currencies = [];
    paths = [];
    //payment: any;
    isShowAmount: boolean = false;
    isShowSendXRPbtn: boolean = false;
    isShowPaths: boolean = false;
    isShowRecipientHelp: boolean = false;
    recipient_help:string = "";
    ngOnDestroy() {
        if(this.timer) clearInterval(this.timer);
        this.timer = null;
        console.log("SendComponent ngOnDestroy");
    }
    recipientInput = new FormControl();
    constructor(private ripple: RippleService, public gv: GlobalVariable, private router: Router) { }
    ngOnInit() {
        this.recipientInput.valueChanges
            .filter(recipient => {
                this.isShowRecipientHelp = false;
                if(!recipient) return false;
                this.destination_address = this.gv.getAddress(this.recipient_label);
                if(this.destination_address) return true;
                if(this.gv.regexp.test(this.recipient_label)) {
                    this.destination_address=this.recipient_label;
                    return true;
                }
                return false;
            })
            .debounceTime(900)
            //.distinctUntilChanged()
            //.switchMap()
            .subscribe(recipient => {
                console.log(recipient);
                this.resolveRecipient();
            })
    }
    returnRecipient(){
        console.log(this.destination_address,this.destination_address!="");
        if(this.destination_address) return;
        this.destination_address=this.recipient_label;
        this.resolveRecipient();
    }
    resolveRecipient() {
        console.log(this.recipient_label,this.destination_address);
        this.isShowAmount = false;
        this.tipinfo_payment = "";
        this.showloading = true;
        this.loading = "正在解析接收方地址信息";
        this.ripple.getTrustlines(this.destination_address).subscribe(result => {
            this.showloading = false;
            this.loading = "";
            console.log(result);
            if (result.ok) {
                const trustlines = result.data;
                this.currencies = [];
                for (let i = 0; i < trustlines.length; i++) {
                    const currency = {
                        name: trustlines[i].specification.currency,
                        issuer: trustlines[i].specification.counterparty
                    }
                    this.currencies.push(currency);
                }
                this.isShowAmount = true;
                if(this.recipient_label!=this.destination_address){
                    this.isShowRecipientHelp = true;
                    this.recipient_help = "接收方钱包地址："+this.destination_address;
                }else{
                    this.isShowRecipientHelp = false;
                }
                console.log(this.currencies);
            } else {
                if (result.data.message == "actNotFound") {
                    this.tipinfo = "对方是未激活钱包";
                    this.currencies = [];
                    this.isShowAmount = true;
                } else {
                    this.isShowRecipientHelp = true;
                    if (result.data.name == "TimeoutError") {
                        this.recipient_help = "超时错误，请稍后再试！";
                    } else {
                        this.recipient_help = "钱包地址错误，"+this.destination_address;
                    }
                };
            }
        });
    }
    setCurrency(currency, label) {
        console.log("setCurrency:",currency);
        if (label) {
            this.Amount = {
                currency: "XRP"
            }
            this.currency_label = label;
        } else {
            this.currency_label = currency.name + "." + currency.issuer;
            this.Amount = {
                currency: currency.name,
                counterparty: currency.issuer
            }
        }
        this.setValue(this.amount_value);
    }
    setValue(value) {
        console.log("setValue:",value);
        if (value && value > 0) {
            this.paths = [];
            this.isShowSendXRPbtn = (this.Amount.currency == "XRP");
            this.Amount.value = value;
            this.pathfind = {
                "source": {
                    "address": this.gv.wallet.address
                },
                "destination": {
                    "address": this.destination_address,
                    "amount": this.Amount
                }
            };
            this.tipinfo = ` 转账/付款：“${this.Amount.value}${this.Amount.currency}” 到对方钱包地址：“${this.destination_address}” `;
            if (!this.timer) this.timer = setInterval(() => { this.findPaths(); }, 10000);
            this.showloading = true;
            this.loading = "正在计算获取支付方式";
            this.findPaths();
        } else {
            this.tipinfo = "请输入发送数量";
        }
    }
    findPaths() {
        console.log("find paths", this.pathfind);
        this.ripple.getPaths(this.pathfind).subscribe(result => {
            this.showloading = false;
            this.loading = "";
            //console.log(result);
            if (result.ok) {
                this.paths = result.data;
                this.isShowPaths = true;
                this.tipinfo_path = `点击上面按钮，将转账/付款 按钮上标注的资产，到接收方钱包地址：${this.destination_address} 对方将收到：${this.Amount.value}${this.Amount.currency}`;
            } else {
                this.paths = [];
                this.isShowPaths = false;
                this.tipinfo_path = "";
                console.log(result.data);
            }
        })
    }
    sendXRP(value) {
        console.log("send", value, "XRP");
        let payment = {
            "source": {
                "address": this.gv.wallet.address,
                "maxAmount": this.pathfind.destination.amount
            },
            "destination": Object.assign({}, this.pathfind.destination) //使用copy赋值，否则sendPayment 中增加tag 或者memos时，污染this.pathfind.destination
        };
        this.sendPayment(payment);
    }
    sendIOU(path) {
        console.log("send", path);
        //this.payment = path;
        this.sendPayment(Object.assign({}, path));
    }
    sendPayment(payment) {
        console.log("payment:", payment);
        if(this.destination_tag) payment.destination.tag = parseInt( this.destination_tag);
        if(this.memo) payment.memos=[{
            "type": "rippleok.com",
            "format": "plain/text",
            "data": encodeURIComponent(this.memo) //decodeURIComponent
        }];
        console.log("payment",payment);
        if(this.invoiceID) payment.invoiceID = this.invoiceID;
        this.showloading = true;
        this.loading = "正在向接收方转账/汇款";
        this.ripple.sendPayment(payment).subscribe(result =>{
            console.log(result);
            this.showloading = false;
            this.loading = "";
            if(result.ok){
                this.isShowAmount = false;
                this.tipinfo_payment = "转账/汇款 成功";
            }else{
                this.tipinfo_payment = "转账/汇款 失败:"+JSON.stringify(result.data);
            }
        })
    }
}
