import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-trustline',
    templateUrl: './trustline.component.html',
    styleUrls: ['./trustline.component.css']
})
export class TrustlineComponent implements OnInit {
    @Input()
    trustline: any;
    constructor() { }

    ngOnInit() {
        console.log(this.trustline);
    }

}
