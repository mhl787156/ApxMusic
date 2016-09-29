import {Component} from "@angular/core";
import {NgClass} from "@angular/common"
import {KeyboardInputComponent} from "./function-area/keyboard-input.component";
import {ControlButtons} from "../utils/control-buttons";

@Component({
    selector : "function-area",
    template :`<section class="function-area"  [ngClass]="{height: getHeight()}">
                    <div class="tab-area">
                        <div class="keyboard-playbutton">
                            <button type="button" class="btn-default btn btn-sm" aria-label="Play" (click)="onPlayClick()">
                                <span class="glyphicon glyphicon-play" aria-hidden="true"></span>
                            </button>
                        </div>
                        <div class="keyboard-stopbutton">
                            <button type="button" class="btn-default btn btn-sm" aria-label="Stop" (click)="onStopClick()">
                                <span class="glyphicon glyphicon-stop" aria-hidden="true"></span>
                            </button>
                        </div>
                        <p class="name">{{name}}</p>
                    </div>
                    <div class="util-area"  *ngIf="isMinimised()">
                       <keyboard-input-component (nameChange)="changeName($event)"
                                                 (callback)="setupCallback($event)"></keyboard-input-component> 
                    </div>
               </section>`,
    styles: [`
               .function-area {
                    background-color: #eeeeee;
                    height: 100%;
                    width:100%;
                }
                
               .tab-area {
                    height:30px;
                    width:100%;
                    line-height: 90%;
                    text-align: left;
                    padding-left: 5px;
               }
               
               .util-area {
                    height:calc(100% - 30px);
                    width:100%;
                    border: 1px solid;
            
               }
               
               .keyboard-playbutton {
                    float: left;
                    padding-top:5px;
               }
               
               .keyboard-stopbutton {
                    float: left;
                    padding-top:5px;
               }
               
               .name {
                    padding-top: 8px;
                    padding-left: 30px;
               }
               
               .function-minimised {
                    position: absolute;
                    top: 0;
                    right: 0;
               }
               
               
            `],
    directives: [KeyboardInputComponent, NgClass]
})

export class FunctionAreaComponent {

    name:string = "No Snippet Loaded";

    playButtonCallback: Callback;

    constructor(){
    }

    changeName($event){
        this.name = $event.name;
    }

    isMinimised(){
        let buttons = ControlButtons.getInstance();
        return buttons.MinimiseBottomBar;
    }

    getHeight(){
        return this.isMinimised()? '0': '100%';
    }

    onPlayClick(){
        this.playButtonCallback.callback('play');
    }

    onStopClick(){
        this.playButtonCallback.callback('stop');
    }

    setupCallback($event){
        this.playButtonCallback = $event;
    }

}

export interface Callback{
    callback: (string) => void;
}

