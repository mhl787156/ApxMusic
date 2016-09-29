import {Component} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {ProjectListComponent} from "./project-list.component";
import {UserService} from "../../../user.service";
import {HTTP_PROVIDERS} from "@angular/http";
import {Project} from "../../../studio_lib/src/data-classes/project";

@Component({
    selector: "home",
    template: `<project-list
                    (refresh)="refresh()"
                    [projects]="recentUserProjects"
                    [title]="title">
               </project-list>
               <button type="button" style="float: right;" class="btn-default btn" aria-label="Step Backwards" (click)="loadRecentUserProjects()">
                    <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
               </button>`,
    directives: [ProjectListComponent, ROUTER_DIRECTIVES],
    providers: [UserService, HTTP_PROVIDERS],
})

export class HomeComponent {
    recentUserProjects:Project[];

    title:string = "Your Recent Projects";

    constructor(private _userService:UserService) {
        this.loadRecentUserProjects();
    }

    loadRecentUserProjects() {
        this._userService.getRecentUserProjects().subscribe(projects => {
            this.recentUserProjects = projects
        })
    }

    refresh() {
        this.loadRecentUserProjects();
    }

}