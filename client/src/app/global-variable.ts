import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVariable {
    lang: number = 1;
    connected:boolean=true;
    wallet: any;
    walletIsActive:boolean=false;
    data: WalletData = new WalletData();
    constructor() { }
}
class WalletData {
    contacts: Array<Contact> = [];
    tradepare:any={};
    constructor() { }
    addContact(name: string, address: string): boolean {
        if (this.existName(name)) return false;
        this.contacts.push(new Contact(name, address));
        return true;
    }
    delContact(name: string): boolean {
        console.log(this.contacts.length);
        for (let i = this.contacts.length; i--;) {
            console.log(i);
            if (this.contacts[i].name == name) {
                this.contacts.splice(i, 1);
            }
        }
        return true;
    }
    existName(name: string): boolean {
        for (let i = 0; i < this.contacts.length; i++) {
            if (name == this.contacts[i].name) return true;
        }
        return false;
    }
    getContact(name:string):Contact{
        for (let i = 0; i < this.contacts.length; i++) {
            if (name == this.contacts[i].name) return this.contacts[i];
        }
        return null;
    }
}
export class Contact {
    name: string;
    address: string;
    constructor(name: string, address: string) {
        this.name = name;
        this.address = address;
    }
}
export class Tipinfo {
    isVisble: boolean = false;
    class: string;
    text: string;
    hide() {
        this.isVisble = false;
    }
    showSuccess(info: string, second: number = 0) {
        this.class = "alert-success";
        this.text = info;
        this.show(second);
    }
    showWarning(info: string, second: number = 0) {
        this.class = "alert-warning";
        this.text = info;
        this.show(second);
    }
    showInfo(info: string, second: number = 0) {
        this.class = "alert-info";
        this.text = info;
        this.show(second);
    }
    showDanger(info: string, second: number = 0) {
        this.class = "alert-danger";
        this.text = info;
        this.show(second);
    }
    show(second: number = 0) {
        this.isVisble = true;
        if (second == 0) {
            return;
        }
        setTimeout(() => { this.isVisble = false }, second * 1000);
    }
}
