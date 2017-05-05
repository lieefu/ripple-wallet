import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-trustline',
    templateUrl: './trustline.component.html',
    styleUrls: ['./trustline.component.css']
})
export class TrustlineComponent implements OnInit {
    @Input()
    trustline: any;
    showedit: boolean = false;
    limit;
    ripplingDisabled: boolean;
    frozen: boolean;
    constructor() { }

    ngOnInit() {
        this.limit = this.trustline.specification.limit;
        this.ripplingDisabled = this.trustline.specification.ripplingDisabled;
        this.frozen = this.trustline.specification.frozen;
    }
    save() {
        console.log(this.limit, this.ripplingDisabled, this.frozen);
    }
}
