/// <reference path="../../typings/fbsdk/fbsdk.d.ts" />

import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {FBConnector} from "ng2-facebook/ng2-facebook";

declare var FB:any;

const authEndpoint = "/fbauth";
const loginTarget = "/loggedin";


@Injectable()
export class FacebookAuthenticatorService {

    fbCon: FBConnector = new FBConnector('1694761154116310');

    constructor(private _http:Http) {
      //  FB.settings.setClientId("1694761154116310");
        this.fbCon.initFB();
    }

    fbauth() {

        /*      FB.accessToken()
         .then((tok) => {
         let params:URLSearchParams = new URLSearchParams();
         params.set("auth_token", tok);

         this._http.get(
         authEndpoint,
         {search: params}
         ).toPromise()
         .then(() => {
         window.location.href = loginTarget;
         });
         });*/
        console.log("fbauth called");
        FB.login(resp => {
                          //noinspection TypeScriptUnresolvedVariable
                let tok:string = resp.authResponse.accessToken;
                          let params:URLSearchParams = new URLSearchParams();
                          params.set("auth_token", tok);
                          
                          this._http.get(
                            authEndpoint,
                            {search: params}
                          ).toPromise()
                           .then(() => {
                                        window.location.href = loginTarget;
                                        });
                         },
                {scope: "email"});
    }

    ting() {
        console.log("awdd");
    }
}
