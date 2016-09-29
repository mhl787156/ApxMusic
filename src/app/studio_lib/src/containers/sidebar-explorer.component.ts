import {Component, Input} from "@angular/core";
import {ExplorerComponent} from "../side-bar/explorer.component";
import {LibraryComponent} from "../side-bar/library.component";
import {SideSettingsComponent} from "../side-bar/side-settings.component"

@Component({
    selector : "sidebar-explorer",
    template : `<section class="apx-sidebar">

                    <nav class="apx-sidebar-nav">
                        <div class="apx-btn-group btn-group btn-group-justified">
                            <div class= "apx-btn-group btn-group" *ngFor="let t of tabs">
                                <button type="button" 
                                        class="apx-btn btn btn-default"
                                        (click)="selectTab(t)"
                                        [ngClass]="{active: isSelected(t)}">
                                    {{t}}
                                </button>
                            </div>
                        </div>
                    </nav>
                    
                    <section class="apx-sidebar-main" [ngSwitch]="currentTab">
                         <p *ngSwitchWhen="tabs[0]">
                            <library></library>
                         </p>
                         <p *ngSwitchWhen="tabs[1]">
                            <apx-side-settings [projectId]="projectId"></apx-side-settings>
                         </p>
                         <p *ngSwitchWhen="tabs[2]">
                            <explorer></explorer>
                         </p>
                    </section>
                    
                </section>`,
    directives: [ExplorerComponent, LibraryComponent, SideSettingsComponent],
    styleUrls: ["app/studio_lib/css/side-bar/sidebar-explorer.component.css"]
})

export class SidebarExplorerComponent {
    @Input() projectId: string;


    tabs: string[] = ["Snippets", "Settings", "Explore"];
    currentTab: string = "";

    constructor(){
        this.currentTab = this.tabs.length==0 ? "" : this.tabs[0];
    }

    selectTab(name:string){
        console.log(name + " was clicked");
        this.currentTab = name;
    }

    isSelected(name:string):boolean{
        return this.currentTab == name;
    }


}
