import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
@Injectable()
export class RippleService {
    constructor(private http: Http) { }
    ///////////////////////
    getWallet(address): Observable<any> {
        return this.httpGet('api/getwallet/' + address);
    }
    getWallets(): Observable<any> {
        return this.httpGet('api/getwallets');
    }
    brainWallet(phrase): Observable<any> {
        return this.httpGet('api/brainwallet/' + phrase);
    }
    newWallet(): Observable<any> {
        return this.httpGet('api/newwallet');
    }
    importWallet(seed): Observable<any> {
        return this.httpGet('api/importwallet/' + seed);
    }
    saveWallet(): Observable<any> {
        return this.httpGet('api/savewallet');
    }
    encryptWallet(address, password) {
        return this.httpGet('api/encryptwallet/' + address + "/" + password);
    }
    decryptWallet(address, password) {
        return this.httpGet('api/decryptwallet/' + address + "/" + password);
    }
    //////////////////////////////////
    accountinfo(address) {
        return this.httpGet("api/accountinfo/" + address);
    }
    getBalances(address) {
        return this.httpGet("api/getbalances/" + address);
    }
    getTrustlines(address) {
        return this.httpGet("api/getTrustlines/" + address);
    }
    ///////////////////////////
    setTrustline(address, trust) {
        return this.httpPost("api/setTrustline/" + address, { trust: trust });
    }
    getPaths(pathfind) {
        return this.httpPost('api/getPaths', { pathfind: pathfind });
    }
    sendPayment(payment) {
        return this.httpPost('api/payment', { payment: payment });
    }
    gateways={
        ripplefox:{
            domain:"ripplefox.com",
            federation_url:"https://ripplefox.com/bridge"
        },
        ripplechina:{
            domain:"iripplechina.com",
            federation_url:"https://ripple.iripplechina.com/bridge"
        }
    };
    bridge(gateway, action,data) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('type', action);
        for(let key in data){
            console.log(key,data[key]);
            params.set(key,data[key]);
        }
          params.set('domain', gateway.domain);
        // params.set('destination', '13901062731/a');
        // params.set('domain', gateway.domain);
        // params.set('type', action);
        // params.set('destination', 'zfb');
        // params.set('domain', domain);
        // return this.http.get('https://ripplefox.com/bridge', { params: params })
        return this.http.get(gateway.federation_url, { params: params })
            .map(this.extractData)
            .catch(this.handleError);
    }
    //////////////////////////////
    private httpGet(url) {
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private httpPost(url, data) {
        return this.http.post(url, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        let data = res.json();
        return data || {};
    }
    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
