import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVariable {
    lang: number = 1;
    wallet: any;
    contacts: Contacts = new Contacts();
    constructor() { }
}
class Contacts {
    data: Array<Contact> = [];
    constructor() { }
    addContact(name: string, address: string): boolean {
        if (this.existName(name)) return false;
        this.data.push(new Contact(name, address));
        return true;
    }
    delContact(name: string): boolean {
        console.log(this.data.length);
        for (let i = this.data.length; i--;) {
            console.log(i);
            if (this.data[i].name == name) {
                this.data.splice(i, 1);
            }
        }
        return true;
    }
    existName(name: string): boolean {
        for (let i = 0; i < this.data.length; i++) {
            if (name == this.data[i].name) return true;
        }
        return false;
    }
    getContact(name:string):Contact{
        for (let i = 0; i < this.data.length; i++) {
            if (name == this.data[i].name) return this.data[i];
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
