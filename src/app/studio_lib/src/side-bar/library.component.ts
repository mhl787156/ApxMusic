import {Component} from "@angular/core";
import {SnippetDataService} from "../../services/snippet.data.service";
import {Snippet} from "../data-classes/snippet";
import {KeyboardSnippetLoader} from "../utils/keyboard-snippet-loader";
import {ControlButtons} from "../utils/control-buttons";
import {CollapseDirective} from "ng2-bootstrap/ng2-bootstrap";

@Component({
    selector : "library",
    template : `<div>
                    <h2>My Snippets</h2>
                    <div class="button-unit">
                        <button type="button" class="btn-default btn new-snippet-button" (click)="newSnippetButton()">
                            New Snippet
                        </button>
                        
                        <button type="button" class="btn-default btn refresh-button" (click)="getAllSnippetIds()">
                            <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                        </button>
                    </div>
                    
                    <br>
                    
                    <p *ngIf="!loadSuccess">We are having trouble loading your snippets, please contact the system administrator</p>
                    
                    <p *ngIf="userSnippets.length == 0">You have no snippets, create a new snippet!</p>
                                        
                    <ul class="list-group">
                       <div class="settings-unit" *ngFor="let snippet of userSnippets let i = index">
                           <button  type="button"
                                    class="list-group-item snippet-list"
                                    [draggable]="true"
                                    (dragstart)="onDragStart($event, snippet)"
                                    (click)="selectSnippet(snippet, i)"
                                    (dblclick)="loadSnippetToKeyboardArea(snippet)">                        
                                    Snippet {{i}}: {{snippet}}
                           </button>
                           <div class="settings-unit" [collapse]="isNotCollapsed != i" *ngIf="selectedSnippet != null">
                               <p>Selected snippet: <input type="text" [(ngModel)]="selectedSnippet.name"><span class="glyphicon glyphicon-pencil"></span></p>
                               <p>Public: <input type="checkbox" [(ngModel)]="selectedSnippet.public"></p>
                               <input type="submit" value="Update" (click)="onSelectedSnippetSubmit()">
                               <input type="submit" value="Edit Notes" (click)="loadSnippetToKeyboardArea(snippet)">
                               <input type="submit" value="Delete" style="float: right" (click)="deleteSnippet()">
                           </div>
                       </div>
                    </ul>
                </div>`,
    styles: [`
        .new-snippet-button {
            float: left;
        }
        
        .refresh-button{
            float: right;
        }
        
        .button-unit {
            width: 100%;
            height: auto;
            margin-bottom: 5px;
            margin-top: 5px;
            padding: 2px;
        }
        
        .settings-unit {
            margin-bottom: 5px;
            margin-top: 5px;
            padding: 2px;
        }
    `],
    directives: [CollapseDirective],
    providers: [SnippetDataService],
})

export class LibraryComponent {
    
    userSnippets: string[] = [];
    loadSuccess: boolean = true;
    selectedSnippet: Snippet = null;
    isNotCollapsed: number = -1;

    constructor(private _snippetDataService: SnippetDataService){
        this.getAllSnippetIds();
    }

    onDragStart($event, snippet: string){
        let obj = {snippetid: snippet}
        $event.dataTransfer.setData("text/plain", JSON.stringify(obj));
        $event.dataTransfer.dropEffect = "copy";
        console.log($event);
    }

    newSnippetButton(){
        this._snippetDataService.postNewSnippetToServer().subscribe(snippet => {
        });
        this.getAllSnippetIds();
    }
    
    getAllSnippetIds(){
        this.isNotCollapsed = -1;
        this._snippetDataService.getAllUserSnippets().subscribe(snippetIds => {
            this.userSnippets = [];
            if(snippetIds == null){
                this.loadSuccess = false;
            }else {
                this.userSnippets = snippetIds;
                this.loadSuccess = true;
            }
        })
    }

    postSnippetChange(snippet: Snippet){
        this._snippetDataService.postSnippetMetaChangeToServer(snippet);
    }
    
    loadSnippetToKeyboardArea(snippetid: string){
        let cb = ControlButtons.getInstance();
        cb.MinimiseBottomBar = true;
        return this._snippetDataService.getSnippetFromServer(snippetid).subscribe(snippet => {
            let ksn = KeyboardSnippetLoader.getInstance();
            ksn.setNotes(snippet);
        });
    }

    selectSnippet(snippetId: string, i){
        if(this.isNotCollapsed == i){
            this.isNotCollapsed = -1;
            return;
        }else {
            return this._snippetDataService.getSnippetFromServer(snippetId).subscribe(snippet => {
                this.selectedSnippet = snippet;
                this.isNotCollapsed = i;
                console.log(this.selectedSnippet);
            })
        }
    }

    onSelectedSnippetSubmit(){
        return this._snippetDataService.postSnippetMetaChangeToServer(this.selectedSnippet).subscribe(res => {
            console.log("Server Response", res);
        })
    }

    deleteSnippet(){
        return this._snippetDataService.postSnippetDeleteToServer(this.selectedSnippet).subscribe(res => {
            console.log("Server Response", res);
        })
    }
}
