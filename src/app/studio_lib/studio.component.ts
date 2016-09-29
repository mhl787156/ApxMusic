import {Component, OnInit} from "@angular/core";
import {TopbarComponent} from "./src/containers/topbar.component";
import {MainAreaComponent} from "./src/containers/main-area.component";
import {BottomBarAreaComponent} from "./src/containers/bottom-bar-area.component";
import {Project} from "./src/data-classes/project";
import {RouteParams} from "@angular/router-deprecated";
import {ProjectDataService} from "./services/project.data.service";

@Component({
    selector : "studio",
    templateUrl : "app/studio_lib/studio.component.html",
    directives: [TopbarComponent, MainAreaComponent, BottomBarAreaComponent],
    providers: [ProjectDataService]
})

export class StudioComponent implements OnInit{

    project:Project;
    projectLoaded: boolean = false;

    constructor(private _projectDataService: ProjectDataService, private _routeparams:RouteParams){
    }

    ngOnInit(){
        return this._projectDataService.getProjectFromServer(this._routeparams.get("id"))
            .subscribe(res => {
                this.project = res;
                this.projectLoaded = true;
                console.log("Loaded this project", this.project.id);
            });
    }
    
    onChange($event){
        this._projectDataService.postProjectMetaChangeToServer(this.project);
    }
}

