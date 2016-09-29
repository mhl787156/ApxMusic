import {Component} from "@angular/core";
import {RouterLink, RouterOutlet, RouteConfig, Router} from "@angular/router-deprecated";
import {UserService} from "../user.service";
import {HomeComponent} from "./src/component/home.component";

@RouteConfig([
    {path: '/home', name: "Home", component: HomeComponent, useAsDefault: true},
])

@Component({
    selector: "dashboard",
    templateUrl: "app/dashboard_lib/html/dashboard.component.html",
    styleUrls: ["app/dashboard_lib/css/dashboard.component.css"],
    directives: [RouterLink, RouterOutlet],
    providers: [UserService]
})

export class DashboardComponent {

    constructor(private _router:Router, private userService:UserService) {

    }

    setActiveTab(tab:number) {
        
    }

    newProject() {
        this.userService.makeNewProject().subscribe(project => {
            console.log("Loading Project from server", project, project.id);
            this._router.navigate(['Project', {id: project.id}]);
        });

    }
}
