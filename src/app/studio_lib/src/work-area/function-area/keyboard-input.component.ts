import {Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter} from "@angular/core";
import {Snippet, SnippetContent} from "../../data-classes/snippet";
import {Note} from "../../data-classes/note";
import {KeyboardSnippetLoader} from "../../utils/keyboard-snippet-loader";
import {SnippetContentDataService} from "../../../services/snippetcontent.data.service";
import {AudioEngineService} from "../../../audio/audio-engine.service";
import {SnippetDataService} from "../../../services/snippet.data.service";

@Component({
    selector : "keyboard-input-component",
    template :`<div #Container class="keyboard-container">
                
                <canvas #keyboard class="keyboard"></canvas>
                <div class="grid-wrapper">
                    <canvas #keyboardGridInput class="keyboard-input" [ngStyle]="{'top': gridSquareHeight}"></canvas>
                </div>
               </div>`,
    styles: [`
               .keyboard-container {
                   float:left;
                   padding: 0;
                   height:100%;
                   width:100%;
                   position:absolute;
                   overflow-y:scroll;
                   padding-bottom: 45px;
               }
               .keyboard {
                   float:left;
               }
               
               .grid-wrapper {
                    overflow-x: scroll
               }
               
               .keyboard-input {
                   float:left;
                   margin-bottom: 4px;
               }

            `],
    providers: [AudioEngineService, SnippetContentDataService, SnippetDataService]
})

export class KeyboardInputComponent implements AfterViewInit{

    @Output() nameChange = new EventEmitter();
    @Output() callback = new EventEmitter();

    @ViewChild("keyboard") keyboardElementRef: ElementRef;
    @ViewChild("keyboardGridInput") canvasElementRef: ElementRef;
    @ViewChild("Container") keyboardContainer: ElementRef;

    kbn: KeyboardSnippetLoader;

    canvas:HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    keyboardctx: CanvasRenderingContext2D;
    parentDiv: HTMLCanvasElement;

    snippet: Snippet;
    snippetContent: SnippetContent;
    notes: Note[][] = [];
    isClicked : boolean[][] = [];

    canvasHeight: number;
    canvasWidth: number;

    noteNames: string[] = ["B","A#","A","G#","G","F#","F","E","D#","D","C#","C"];

    keyHeight = 20;
    keyWidth = 150;
    keyboardNumKeySets: number = 7;
    keyboardNumKeys:number = this.keyboardNumKeySets * 12;

    keyboardTopX: number = 0;
    keyboardTopY: number = 0;

    defaultGridWidthInSquares = 100;
    gridWidthInSquares: number = this.defaultGridWidthInSquares;
    gridSquareHeight: number = this.keyHeight;
    gridSquareWidth: number = 30;
    gridTopX: number = 0;
    gridTopY: number = 0;

    // mouseX: number;
    mouseY: number;
    rulerHeight: number = this.keyHeight;

    constructor(private _audioEngine: AudioEngineService, private _snippetContentService: SnippetContentDataService,
                    private _snippetService: SnippetDataService){
        this.isClicked = this.new2DBoolArray();
    }

    ngAfterViewInit():any {
        this.canvas = this.canvasElementRef.nativeElement;
        this.parentDiv = this.keyboardContainer.nativeElement;

        let keyboardCanvas = this.keyboardElementRef.nativeElement;
        this.keyboardctx = keyboardCanvas.getContext("2d");

        this.canvasHeight = this.keyHeight * this.keyboardNumKeys;
        this.canvasWidth = this.gridSquareWidth * this.gridWidthInSquares;

        keyboardCanvas.style.height = this.canvasHeight.toString() + 'px';
        keyboardCanvas.style.width = this.keyWidth.toString() + 'px';

        keyboardCanvas.width = keyboardCanvas.offsetWidth;
        keyboardCanvas.height = keyboardCanvas.offsetHeight;

        this.canvas.style.height = this.canvasHeight.toString() + 'px';
        this.canvas.style.width = this.canvasWidth.toString() + 'px';

        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        this.parentDiv.scrollTop = Math.floor(this.canvasHeight / 2);

        this.ctx = this.canvas.getContext("2d");

        this.canvas.addEventListener('click', e => this.onGridClick(e), false);
        this.canvas.addEventListener('mousemove', e=> {
            // this.mouseX = e.offsetX;
            this.mouseY = e.offsetY - this.parentDiv.scrollTop;
        }, false);

        this.callback.emit({
            callback: (param:string) => this.playNoteCallback(param)
        });

        this.kbn = KeyboardSnippetLoader.getInstance();
        this.kbn.setKICallback(snippet => this.loadSnippet(snippet));

        this.renderKeyboard();
        this.tick();
    }

    // On each Frame we Tick
    tick(){
        window.requestAnimationFrame(()=>this.tick());
        this.resize();
        this.renderGrid();
        this.renderRuler();
    }

    resize(){
        this.canvasWidth = this.gridSquareWidth * this.gridWidthInSquares;
        this.canvas.style.width = this.canvasWidth.toString() + 'px';
        this.canvas.width = this.canvas.offsetWidth;
    }


    // Dealing with the server
    public loadSnippet(snippet: Snippet){
        this.isClicked = this.new2DBoolArray();
        this.closeSubscriptin();
        if(snippet == null){
            snippet = new Snippet();
            this.notes = [];
        }else{
            this.snippet = snippet;
            this._snippetContentService.getSnippetContentFromServer(snippet.id)
                .subscribe(req => {
                    console.log(req);
                    this.snippetContent = req;
                    this.loadSnippetContent();
                    this.subscribeToSnippetChanges();
                });
        }
        
        this.nameChange.emit({name: snippet.name});
    }

    private loadSnippetContent(){
        if(this.snippetContent.notes == null){
            this.snippetContent.notes = [];
        }

        let notes = this.snippetContent.notes;
        this.notes = notes;

        this.gridWidthInSquares = notes.length + 50;

        for(var i = 0; i < notes.length; i++){
            for(var j = 0; j < notes[i].length; j++) {
                let note = notes[i][j];
                let k = this._audioEngine.notetoGridIndex(note.pitch);
                this.setClicked(i, k);
            }
        }
    }
    
    private postChangeToServer(){
        if(this.snippetContent == null){
            return;
        }
        this._snippetContentService.postToServer(this.snippetContent).subscribe(e=>{

        });
    }

    private postSnippetChangeToServer(){
        if(this.snippet == null){
            return;
        }
        console.log("Posting SNippet from keyboard input (updating duration)" , this.snippet);
        this._snippetService.postSnippetMetaChangeToServer(this.snippet)
            .subscribe(e => {});

        let ksn = KeyboardSnippetLoader.getInstance();
        ksn.callCallback(this.snippet.duration);
    }

    private subscribeToSnippetChanges(){
        this._snippetContentService.subscribeToSnippet(this.snippetContent.id)
            .subscribe(res => {
                if(res == null){
                    return;
                }
                this.snippetContent = res;
                this.loadSnippetContent();
            })
    }

    private closeSubscriptin() {
        this._snippetContentService.closeSubsciptionToSnippet();
    }


    //Snippet Playback
    private playNoteCallback(param: string){
        if(param == 'play'){
            this.playNotes();
        }
        if(param == 'stop'){
            this.stopNotes();
        }
    }

    private playNotes(){
        this._audioEngine.polyphonicSinglePlay(this.notes);
    }

    private stopNotes(){
        this._audioEngine.stopPlay();
    }

    //Set Click Logic
    private onGridClick(e){
        let xval = e.offsetX - this.gridTopX;
        let yval = e.offsetY;

        let x = Math.floor(xval / (this.gridSquareWidth));
        let y = Math.floor(yval / (this.gridSquareHeight));

        let bah = this.notes.length;

        if(this.isClicked[x][y]){
            this.setUnClicked(x,y);

            let pitch = this._audioEngine.gridIndextoNote(y);
            this.removeNote(pitch, x);
        }else{
            this.setClicked(x,y);
            let pitch = this._audioEngine.gridIndextoNote(y);
            this._audioEngine.playNote(pitch);
            this.insertNote(new Note(pitch, x));
        }

        if(this.notes.length != bah && this.snippet != null) {
            this.snippet.duration = this.notes.length;
            console.log("Posting duration change to server");
            this.postSnippetChangeToServer();
        }
        this.postChangeToServer();
    }

    private setClicked(x, y){
        this.isClicked[x][y] = true;
    }

    private setUnClicked(x, y){
        this.isClicked[x][y] = false;
    }


    private insertNote(note: Note){
        if(note.starttime < this.notes.length){
            this.notes[note.starttime].push(note);
        }else{
            while(this.notes.length <= note.starttime){
                this.notes.push([]);
            }
            this.notes[note.starttime].push(note);
        }
    }

    private removeNote(note: string, time: number){
        if(this.notes.length <= time){
            return;
        }
        for(var i = 0 ; i < this.notes[time].length; i++){
            if(this.notes[time][i].pitch == note){
                this.notes[time].splice(i, 1);
                break;
            }
        }

        let p = this.notes.length - 1;
        let k = 0;
        while(this.notes[p].length == 0){
            p--; k++;
        }
        this.notes.splice(p, k);
    }




    // UI Rendering
    private renderRuler(){
        let ypos = 0;
        if(this.mouseY > 0 && this.mouseY < this.rulerHeight){
            ypos = this.gridTopY + this.parentDiv.scrollTop + this.parentDiv.offsetHeight - 30 - this.rulerHeight;
        }else {
            ypos = this.gridTopY + this.parentDiv.scrollTop;
        }
        this.renderBox(this.ctx, this.gridTopX, ypos, this.canvasWidth, this.rulerHeight, '#ffffcc');
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        //Draw Vertical Lines
        for(var i = 0; i < this.gridWidthInSquares + 1; i++){
            let xpos = i * this.gridSquareWidth + this.gridTopX;
            let yposa = ypos + (i % 4 == 0? (i % 16 == 0? 0 : this.rulerHeight / 3) : 2*this.rulerHeight/3);
            this.ctx.lineWidth = (i % 16 == 0 ? 1.5 : 1);
            this.renderLine(this.ctx, xpos, yposa, xpos, ypos + this.rulerHeight);
        }
    }

    private renderKeyboard(){
        for(var i = 0 ; i < this.keyboardNumKeySets; i++) {
            let ypos = this.keyHeight * 12 * i;
            this.renderKeySet(0, ypos, i);
        }
    }

    private renderKeySet(x: number, y: number, octave:number){
        this.keyboardctx.font = '12pt Calibri';
        for(var i = 0 ; i < 12 ; i++){
            let ypos = (this.keyHeight * i) + y;
            if([0,2,4,6,7,9,11].indexOf(i) == -1){
                this.renderKey(0,ypos, 'black');
                this.keyboardctx.fillStyle = 'white';
            }else{
                this.renderKey(0, ypos, 'white');
                this.keyboardctx.fillStyle = 'black';
            }
            this.keyboardctx.fillText(this.noteNames[i] + (7 - octave).toString(), this.keyWidth - 30, ypos + this.keyHeight - 3);
        }
    }

    private renderKey(x: number, y:number, color: string){
        this.keyboardctx.beginPath();
        this.keyboardctx.rect(x, y, this.keyWidth, this.keyHeight);
        this.keyboardctx.fillStyle = color;
        this.keyboardctx.fill();
        this.keyboardctx.strokeStyle = color=='black' ? 'white' : 'black';
        this.keyboardctx.stroke();
    }

    private renderGrid(){
        this.ctx.strokeStyle = '#444444';
        this.ctx.lineWidth = 1;

        //Draw Horizontal Lines
        for(var i = 0; i < this.keyboardNumKeys + 1; i++){
            let ypos = i * this.gridSquareHeight;
            this.renderLine(this.ctx, this.gridTopY, ypos, this.canvasWidth, ypos);
        }

        //Draw Vertical Lines
        for(var i = 0; i < this.gridWidthInSquares + 1; i++){
            let xpos = i * this.gridSquareWidth + this.gridTopX;
            this.renderLine(this.ctx, xpos, this.gridTopY, xpos, this.canvasHeight)
        }

        for(var i = 0; i < this.isClicked.length ; i++){
            for(var j = 0; j < this.isClicked[i].length; j++){
                if(this.isClicked[i][j]){
                    this.drawRedSquare(i, j);
                }
            }
        }
    }

    private drawRedSquare(x:number, y:number){
        let xpos = x * this.gridSquareWidth;
        let ypos = y * this.gridSquareHeight;
        this.renderBox(this.ctx, xpos+1, ypos+1, this.gridSquareWidth-2, this.gridSquareHeight-2, 'red');
    }

    renderLine(ctx:CanvasRenderingContext2D, x1:number, y1:number, x2:number, y2:number){
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    renderBox(ctx:CanvasRenderingContext2D, x: number, y:number,  width:number, height:number, color:string){
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(x, y, width, height);
        ctx.fill();
    }


    // Utils

    new2DBoolArray(): boolean[][] {
        return this._make2DArray(this.gridWidthInSquares, this.keyboardNumKeys, false);
    }

    _make2DArray(w, h, val) {
        var arr: any[][] = [];
        for(var i = 0; i < h; i++) {
            var arr2: any[] = [];

            for(var j = 0; j < w; j++) {
                arr2.push(val);
            }

            arr.push(arr2);
        }
        return arr;
    }

    _makeArray(l){
        var arr: any[] = [];
        for(var i = 0; i < l; i++) {
            arr.push(i);
        }
        return arr;
    }
}
   