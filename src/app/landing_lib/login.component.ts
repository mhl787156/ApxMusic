import {Component} from "@angular/core";
import {FacebookAuthenticatorService} from "../facebook-authenticator.service";
@Component({
    selector: "login",
    template: `<h1 class="cover-heading">Sign In with Facebook</h1>
               <button class="btn btn-lg btn-social btn-facebook" (click)="signin()">
                 <i class="fa fa-facebook"></i>
                 Sign In
               </button>
              `,
    styleUrls: ["built/app/landing_lib/signin.css"],
    providers: [FacebookAuthenticatorService]
})

export class LoginComponent {
    constructor(private _fb:FacebookAuthenticatorService) {
    }

    signin() {
        console.log("yay");
        this._fb.fbauth();
    }

}

