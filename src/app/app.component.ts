import {Component, OnInit} from "@angular/core";
import {TopBarComponent} from "./top-bar.component";
import {MdButton, MD_BUTTON_DIRECTIVES} from '@angular2-material/button';
import {UserService} from "./user.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';
import {Notification} from "./models/notification";
import {RouteConfig, RouterOutlet, Router} from "@angular/router-deprecated";
import {ProjectComponent} from "./project.component";
import {DashboardComponent} from "./dashboard_lib/dashboard.component";
import {LandingComponent} from "./landing.component";
import {ProfileComponent} from "./profile.component";
import {NotFoundComponent} from "./not-found.component";
import {HTTP_PROVIDERS} from "@angular/http";
import {FacebookAuthenticatorService} from "./facebook-authenticator.service";

@RouteConfig([
    {path: '/...', name: "Landing", component: LandingComponent, useAsDefault : true},
    {path: '/dashboard/...', name: "Dashboard", component: DashboardComponent},
    {path: '/project/:id', name: "Project", component: ProjectComponent},
    {path: '/profile/', name: "Profile", component: ProfileComponent},
    {path: '*other', name: "NotFound", component: NotFoundComponent}
])

@Component({
    selector: "my-app",
    templateUrl: "app/html/app.component.html",
    styleUrls: ["app/css/app.component.css"],
    directives: [TopBarComponent, DashboardComponent, RouterOutlet, MD_BUTTON_DIRECTIVES, MdButton, LandingComponent],
    providers: [UserService,HTTP_PROVIDERS, FacebookAuthenticatorService]
})
export class AppComponent implements OnInit {


    constructor(private _userService:UserService, private _router : Router) {}


    ngOnInit() {
        //noinspection TypeScriptUnresolvedFunction
        Observable.forkJoin(
            this._userService.getNotifications("")
        )
            .subscribe(res => {
                console.log(res[0]);
            });
    }


}
