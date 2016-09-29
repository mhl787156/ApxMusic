import {Component, Input} from "@angular/core";
import {MenuBarComponent} from "../top-bar/menu-bar.component";
import {Project} from "../data-classes/project";
import {ProjectDataService} from "../../services/project.data.service";
import  {MD_INPUT_DIRECTIVES, MdInput} from "@angular2-material/input";

@Component({
    selector: "topbar",
    template: `<section class="apx-top-menu">
                    <menu-bar></menu-bar>
                    <div class="apx-project-name">
                      <span *ngIf="!name_edit" (dblclick)="toggleEdit()"> {{project?.name}} </span> 
                      <md-input *ngIf="name_edit"  value="{{project?.name}}" (keyup)="doneTyping($event)" placeholder="Title" class="demo-full-width"></md-input>        
                    </div>
                </section>`,
    styles: [`  .apx-top-menu {
                    position:relative;
                    z-index: 10;
                    height: 22px;
                    width:100%;
                    vertical-align: middle;
                    text-align: left;
                    background-color: #CCCCCC;
                    border: 1px solid black;
                }
                
                .apx-project-name{
                    text-align: center;
                    width: 100%;
                    height: 25px;
                }
            `],
    directives: [MenuBarComponent, MD_INPUT_DIRECTIVES, MdInput],

})

export class TopbarComponent {

    @Input() project:Project;

    name_edit:boolean = false;

    constructor(private _projectDataService:ProjectDataService) {

    }

    doneTyping($event) {
        if ($event.which === 13) {
            this.setTitle($event.target.value);
        }
    }

    toggleEdit() {
        console.log("TOLGGER");
        this.name_edit = !this.name_edit;
    }

    setTitle(name:string) {
        this.project.name = name;
        this._projectDataService.postProjectMetaChangeToServer(this.project).subscribe(res => {
            this.toggleEdit();
        });
    }


}
