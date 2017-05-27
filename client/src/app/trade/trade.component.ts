import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';

@Component({
    selector: 'app-trade',
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }
    asks: Array<BookOrder> = new Array();
    bids: Array<BookOrder> = new Array();
    limit: number = 20;
    buy_quantity:number;
    buy_price:number;
    buy_totalPrice:number;

    sell_quantity:number;
    sell_price:number;
    sell_totalPrice:number;
    orderbook:Orderbook=new Orderbook();
    buys:Array<MyOrder> = new Array();
    sells:Array<MyOrder> = new Array();

    sellTipinfo:Tipinfo=new Tipinfo();
    buyTipinfo:Tipinfo=new Tipinfo();
    ngOnInit() {
        this.initBookOrders();
        this.orderbook.setBase("XRP");
        //this.orderbook.setCounter("CNY","razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA");//"rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y");
        this.orderbook.setCounter("CNY","rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y");
        this.getOrderbook();
        this.getMyOrders();
        setInterval(()=>{this.getOrderbook()},10000);
        setInterval(()=>{this.getMyOrders()},30000);
    }
    focusAutoBuyValue(type,v1,v2,v3){
        console.log(type,v1,v2,v3);
        if(type==1&&v2&&v3){
            this.buy_quantity=v3/v2;
        }else if(type==2&&v1&&v3){
            this.buy_price=v3/v1;
        }else if(type==3&&v1&&v2){
            this.buy_totalPrice=v1*v2;
        }
    }
    focusAutoSellValue(type,v1,v2,v3){
        console.log(type,v1,v2,v3);
        if(type==1&&v2&&v3){
            this.sell_quantity=v3/v2;
        }else if(type==2&&v1&&v3){
            this.sell_price=v3/v1;
        }else if(type==3&&v1&&v2){
            this.sell_totalPrice=v1*v2;
        }
    }
    addOrder(direction:string,quantity:number,totalPrice:number){
        let tipinfo = this.buyTipinfo;
        if(direction=="sell"){
            tipinfo= this.sellTipinfo;
        }
        tipinfo.hide();
        let order:Order = new Order();
        order.direction=direction;
        order.setQuantity(this.orderbook.base.currency,this.orderbook.base.counterparty,quantity);
        order.setTotalPrice(this.orderbook.counter.currency,this.orderbook.counter.counterparty,totalPrice);
        console.log(order);
        this.ripple.addOrder(this.gv.wallet.address,order).subscribe(result =>{
            console.log(result);
            if(result.ok){
                tipinfo.class ="alert-success";
                tipinfo.text = "挂单成功";
                this.delayGetMyOrders();
            }else{
                tipinfo.class ="alert-danger";
                if(result.data.resultCode==="tecUNFUNDED_OFFER"){
                    tipinfo.text = "余额不足。";
                }else{
                    tipinfo.text = result.data.resultMessage;
                }
            }
            tipinfo.show(6);
            console.log(tipinfo);
        })
    }
    cancelOrder(sequence){
        console.log("cancelOrder",sequence);
        this.ripple.cancellOrder(this.gv.wallet.address,sequence).subscribe(result =>{
            console.log(result);
            this.delayGetMyOrders();
        })
    }
    delayGetMyOrders(){
        setTimeout(()=>{this.getMyOrders()},10000);//提交成功后，要下个总账才能获取到，立即得不到；
    }
    getMyOrders(){
        console.log("getMyOrders");
        this.ripple.getOrders(this.gv.wallet.address).subscribe(result=>{
            console.log(result);
            this.setMyOrders(result.data);
        })
    }
    initBookOrders(){
        for(let i=0;i<this.limit;i++){
            if (!this.asks[i]) this.asks.push(new BookOrder());
            if (!this.bids[i]) this.bids.push(new BookOrder());
        }
    }
    getOrderbook() {
        console.log("get orderbook");
        this.ripple.getOrderbook(this.gv.wallet.address, this.orderbook, this.limit).subscribe(result => {
            if (result.ok) {
                this.setBookOrders(this.asks, result.data.asks);
                this.setBookOrders(this.bids, result.data.bids)
            } else {
                console.log("获取交易挂单数据失败",result);
            }
        })
    }
    setMyOrders(myorders){
        let selli=0;
        let buyi=0;
        this.sells=[];
        this.buys=[];
        for(let i=0;i<myorders.length;i++){
            let myorder=myorders[i];
            let tmp_order:MyOrder;
            console.log(myorder);
            if(myorder.specification.direction==="sell"){
                if(!this.sells[selli]) this.sells.push(new MyOrder());
                tmp_order=this.sells[selli];
                selli++;
            }else{
                if(!this.buys[buyi]) this.buys.push(new MyOrder());
                tmp_order=this.buys[buyi];
                buyi++;
            };
            let goods_value: number = parseFloat(myorder.specification.quantity.value);
            let money_value: number = parseFloat(myorder.specification.totalPrice.value);
            tmp_order.price = (money_value / goods_value).toFixed(5);

            tmp_order.goods.currency = myorder.specification.quantity.currency;
            tmp_order.goods.counterparty = myorder.specification.quantity.counterparty;
            tmp_order.goods.counterparty_short = this.shortAddress(tmp_order.goods.counterparty);
            tmp_order.goods.value = goods_value.toFixed();

            tmp_order.money.currency = myorder.specification.totalPrice.currency;
            tmp_order.money.counterparty = myorder.specification.totalPrice.counterparty;
            tmp_order.money.counterparty_short = this.shortAddress(tmp_order.money.counterparty);
            tmp_order.money.value = money_value.toFixed(2);
            tmp_order.sequence = myorder.properties.sequence;
        }
        console.log("myorder:",this.buys,this.sells);
    }
    setBookOrders(d_orders: Array<BookOrder>, s_orders) {
        let sum_goods: number = 0;
        let sum_money: number = 0;
        for (let i = 0; i < s_orders.length; i++) {
            let order: BookOrder = d_orders[i];
            let goods: number = parseFloat(s_orders[i].specification.quantity.value);
            let money: number = parseFloat(s_orders[i].specification.totalPrice.value);
            order.price = (money / goods).toFixed(5);
            sum_goods += goods;
            sum_money += money;
            order.goods = goods.toFixed();
            order.money = money.toFixed(2);
            order.sum_goods = sum_goods.toFixed();
            order.sum_money = sum_money.toFixed(2);
            order.address = s_orders[i].properties.maker;
            order.address_short = this.shortAddress(order.address);
            if(order.address==this.gv.wallet.address){
                order.color="green";
            }else{
                order.color="";
            }
        }
    }
    shortAddress(address){
        if(!address) return "";
        let len = address.length;
        return  address.substr(0, 5) + "..." + address.substring(len - 3, len);
    }
}

class BookOrder {
    price: string;
    goods: string;
    money: string;
    sum_goods: string;
    sum_money: string;
    address: string;
    address_short: string;
    color:string;
}
class MyAmount{
    currency:string;
    counterparty:string;
    counterparty_short:string;
    value:string;
}
class MyOrder {
    price: string;
    goods: MyAmount = new MyAmount();
    money: MyAmount = new MyAmount();;
    sequence:number;
}

class Amount{
    currency:string;
    counterparty:string;
    value:string;
    public constructor(currency:string,counterparty:string,value:number){
        this.currency=currency;
        this.counterparty=counterparty;
        this.value = parseFloat(value.toString()).toFixed(9);
        if(currency=="XRP"){
            delete this.counterparty;
        }
    }
}
class Order {
    direction: string;
    quantity: Amount;
    totalPrice: Amount;
    passive: boolean=true;
    fillOrKill: boolean=false;
    setQuantity(currency:string,counterparty:string,value:number){
        this.quantity = new Amount(currency,counterparty,value);
    }
    setTotalPrice(currency:string,counterparty:string,value:number){
        this.totalPrice = new Amount(currency,counterparty,value);
    }
}
class Currency{
    currency:string;
    counterparty:string;
    public constructor(curr_name:string,address:string){
        this.currency=curr_name;
        this.counterparty=address;
        if(curr_name=="XRP"){
            delete this.counterparty;
        }
    }
}
class Orderbook{
       base: Currency;
       counter: Currency;
       setBase(curr_name:string,address:string=""){
           this.base = new Currency(curr_name,address);//this.getCurrency(curr_name,address);
       }
       setCounter(curr_name:string,address:string=""){
           this.counter = new Currency(curr_name,address);//this.getCurrency(curr_name,address);
       }
}

class Tipinfo{
    isVisble:boolean=false;
    class:string;
    text:string;
    hide(){
        this.isVisble=false;
    }
    show(second:number=0){
        this.isVisble = true;
        if(second==0){
            return;
        }
        setTimeout(()=>{this.isVisble=false},second*1000);
    }
}
