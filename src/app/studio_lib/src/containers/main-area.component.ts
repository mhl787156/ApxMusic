import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {SidebarExplorerComponent} from "./sidebar-explorer.component";
import {ProjectContent} from "../data-classes/project-content";
import {ProjectContentDataService} from "../../services/projectcontent.data.service";
import {ControlButtons} from "../utils/control-buttons";
import {ArrangementAreaComponent} from "../work-area/arrangement-area.component";
import {NgStyle} from "@angular/common";
import {FunctionAreaComponent} from "../work-area/function-area.component";
import {TrackSettingsComponent} from "../work-area/track-settings.component";
import {TrackNode, Track} from "../data-classes/track";
import {SnippetDataService} from "../../services/snippet.data.service";
import {SnippetContent} from "../data-classes/snippet";
import {SnippetContentDataService} from "../../services/snippetcontent.data.service";
import {AudioPlayer} from "../../audio/audio-player";

@Component({
    selector : "main-area",
    template: `<section class="apx-main-area">
                 <section class="apx-work-area" 
                    [ngStyle]="{width: sidebarAreaMaximiseLeft()}"
                    *ngIf="hasLoaded()">
                     <div style="overflow-y: scroll">
                         <track-settings [tracks]="projectContent?.tracks" 
                                         class="apx-track-settings"
                                         (onchange)="onChange($event)"
                                         [ngStyle]="{height: functionAreaMinimiseTop()}"></track-settings>
                         <arrangement-area *ngIf="projectTracksExist()"
                                           [tracks]="projectContent?.tracks"
                                           (onchange)="onChange($event)"
                                           class="apx-arrangement-area"
                                           [ngStyle]="{height: functionAreaMinimiseTop()}"></arrangement-area>
                     </div>
                     <function-area class="apx-function-area"
                            [ngStyle]="{height: functionAreaMinimiseBottom()}"></function-area>
                 </section>
                 <sidebar-explorer [projectId]="projectContentId" *ngIf="sidebarAreaMinimiseRight()"></sidebar-explorer>
               </section>`,
    styles: [`
            .apx-main-area {
                 height: calc(100vh - 145px);
            }
        `],
    styleUrls: ["built/app/studio_lib/css/work-area/work-area.component.css"],
    directives: [SidebarExplorerComponent, ArrangementAreaComponent, TrackSettingsComponent, FunctionAreaComponent, NgStyle],
    providers: [ProjectContentDataService,SnippetDataService, SnippetContentDataService]
})

export class MainAreaComponent implements OnInit{

    @Input() projectContentId :string;

    projectContent: ProjectContent;
    loaded: boolean = false;

    constructor(private _dataService: ProjectContentDataService, 
                private _snippetContentDataService: SnippetContentDataService){
    }

    hasLoaded(){
        return this.loaded;
    }

    ngOnInit():any {
        this.getProjectContent();    
        let cb = ControlButtons.getInstance();
        cb.setAudioPlayerGenerator(() =>
            new AudioPlayer(this.projectContent, this._snippetContentDataService));
    }

    // Events
    onChange($event){
       this.sendProjectContent();
    }

    // Server Communication
    getProjectContent(){
        console.log(this.projectContentId);
        return this._dataService.getProjectContentFromServer(this.projectContentId)
            .subscribe(res => {
                this.projectContent = res;
                this.loaded = true;
                this.subscribeToProject()
            });
    }
    
    sendProjectContent(){
        return this._dataService.postProjectContentToServer(this.projectContent)
            .subscribe(res => {})
    }


    subscribeToProject(){
         this._dataService.subscribeToProject(this.projectContent.id)
             .subscribe(res => {
                 this.projectContent = res;
             });
    }

    // Utils
    projectLoaded(){
        return this.projectContent != null;
    }

    projectTracksExist(){
        return this.projectContent.tracks != null;
    }

    // CSS Controls
    sidebarAreaMinimiseRight(){
        let buttons = ControlButtons.getInstance();
        return buttons.MinimiseSideBar;
    }

    sidebarAreaMaximiseLeft(){
        let buttons = ControlButtons.getInstance();
        return buttons.MinimiseSideBar? '80%' : '100%';
    }

    functionAreaMinimiseTop(){
        let buttons = ControlButtons.getInstance();
        return buttons.MinimiseBottomBar? '80%': '100%';
    }

    functionAreaMinimiseBottom(){
        let buttons = ControlButtons.getInstance();
        return buttons.MinimiseBottomBar? '20%': '0%';
    }
}
