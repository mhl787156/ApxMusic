import {Component, OnInit, Input} from "@angular/core";
import {ProjectDataService} from "../../services/project.data.service";
import {Project} from "../data-classes/project";

@Component({
    selector : "apx-side-settings",
    templateUrl : "app/studio_lib/html/side-bar/side-settings.component.html",
    styleUrls: ["app/studio_lib/css/side-bar/side-settings.component.css"],
    providers: [ProjectDataService],
})

export class SideSettingsComponent implements OnInit{
    @Input() projectId: string;

    project: Project;
    projectLoaded: boolean = false;
    instrument: string = 'sine';
    
    constructor(private _projectDataService: ProjectDataService){
        
    }

    ngOnInit(){
        return this._projectDataService.getProjectFromServer(this.projectId)
            .subscribe(res => {
                this.project = res;
                this.projectLoaded = true;
            });
    }
    
    postProjectMetaToServer(){
        return this._projectDataService.postProjectMetaChangeToServer(this.project).subscribe(res => {
            console.log(res);
        })
    }
}

/*
 Settings


    Studio/Editor settings
        Theme?
        Others if we think of them
 */