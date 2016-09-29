import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnInit} from "@angular/core";
import {Track, TrackNode} from "../data-classes/track";
import {KeyboardSnippetLoader} from "../utils/keyboard-snippet-loader";
import {SnippetDataService} from "../../services/snippet.data.service";
import {SnippetContentDataService} from "../../services/snippetcontent.data.service";
import {ControlButtons} from "../utils/control-buttons";
import {AudioEngineService} from "../../audio/audio-engine.service";

declare var Tone:any;

@Component({
    selector : "arrangement-area",
    template :`<section #parent class="arrangement-area">
                 <canvas #arrangementAreaCanvas 
                         class="arrangement-area-canvas"
                         (drop)="onDrop($event)"
                         (dragover)="onDragOver($event)"
                         ></canvas>
               </section>`,

    styleUrls: ["app/studio_lib/css/work-area/arrangement-area.component.css"],
    providers: [SnippetDataService, SnippetContentDataService]
})

export class ArrangementAreaComponent implements OnInit, AfterViewInit{

    // A list of Tracks of this project
    @Input() tracks: Track[];
    @Output() onchange = new EventEmitter();

    @ViewChild("arrangementAreaCanvas") arrangementAreaElementRef: ElementRef;
    @ViewChild("parent") parentElement: ElementRef;
    parentCanvas:HTMLCanvasElement;

    canvas:HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    rendered:boolean = false;

    canvasHeight: number = 150;
    canvasWidth: number = 1600; // TODO currently fixed, should be variable

    trackHeight: number = 150;


    // Canvas Styles
    beatGridWidth: number = 40;
    quarterBeatGridWidth: number = this.beatGridWidth / 4;
    numGrids: number = Math.floor(this.canvasWidth / this.beatGridWidth);

    rulerHeight:number = 20;

    canvasTopX: number = 0;
    canvasTopY: number = this.rulerHeight;


    //Snippet Styles
    snippetNameBarHeight = Math.floor(this.trackHeight / 8);

    mouseX: number;
    mouseY: number;
    mouseClickHold: boolean;
    mouseClickedTrack: Track;
    mouseClickedTrackNode: TrackNode;
    mouseTrackNodeOffsetX: number;
    mouseTrackNodeOffsetY: number;


    constructor(private _dataService:SnippetDataService, private _dataContentService: SnippetContentDataService){
       let buttons = ControlButtons.getInstance();
       buttons.setAddTrackFunction(()=>this.addNewTrack());
        if(this.tracks == null){
            this.tracks = [];
        }
    }

    ngOnInit(): any{
        for(var i = 0 ; i < this.tracks.length; i++){
            let track: Track = this.tracks[i];
            for(var j = 0; j < track.tracknodes.length; j++){
                let tracknode: TrackNode = track.tracknodes[j];
                this._dataService.getSnippetFromServer(tracknode.snippetid).subscribe(s => {
                    tracknode.duration = s.duration;
                    tracknode.snippetname = s.name;
                })
            }
        }
    }

    ngAfterViewInit():any {
        this.canvas = this.arrangementAreaElementRef.nativeElement;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.addEventListener("dblclick", e => {
            e.preventDefault();
            this.onDblClick(e);
        }, false);

        this.canvas.addEventListener("mousemove", e => {
            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;
        }, false);

        this.canvas.addEventListener("mousedown", e => {
            this.onMouseDown(e.offsetX, e.offsetY);
        },false)

        this.canvas.addEventListener("mouseup", e => {
            this.onMouseUp(e.offsetX, e.offsetY)
        },false)

        this.canvas.addEventListener("mouseleave", e => {
            this.mouseClickHold = false;
            this.mouseClickedTrack = null;
            this.mouseClickedTrackNode = null;
        })

        this.parentCanvas = this.parentElement.nativeElement;

        this.renderRuler();
        this.tick();
    }

    //UI Tick
    tick(){
        window.requestAnimationFrame(()=>this.tick());
        this.resize();
        this.renderTracks();
        this.renderRuler();
        if(this.mouseClickHold && this.mouseClickedTrackNode != null){
            this.renderPhantomTrackNode();
        }
        this.renderTransportLine();
    }

    addNewTrack(){
        if(this.tracks == null){
            this.tracks = [new Track()];
        }
        this.tracks.push(new Track());
        // Notify server that track has been created
        this.onchange.emit({});
    }
    
    //Event Handlers
    onDblClick(e){
        let tracknode:TrackNode = this.getTracknodeFromMouse(e.offsetX, e.offsetY);
        if(tracknode!= null) {
            let cb = ControlButtons.getInstance();
            cb.MinimiseBottomBar=true;
            this._dataService.getSnippetFromServer(tracknode.snippetid)
                .subscribe(snippet => {
                    console.log("loading snippet", tracknode);
                    let kns: KeyboardSnippetLoader = KeyboardSnippetLoader.getInstance();
                    kns.setNotes(snippet, duration => {
                        tracknode.duration = duration;
                        this.onchange.emit({});
                    });
                })
        }
    }

    onDrop($event){
        event.preventDefault();
        event.stopPropagation();

        let rawdata = $event.dataTransfer.getData("text");
        if(rawdata == null) {
            return
        }
        let dataobj = JSON.parse(rawdata);

        if(dataobj.snippetid != null || dataobj.snippetid != undefined) {
            let starttime:number = this.getStartTimeFromMouseX($event.offsetX);
            let track:Track = this.getTrackFromMouseY($event.offsetY);
            if(track == null){
                return;
            }
            this.addSnippetToTrack(dataobj.snippetid, starttime, track);
        }
    }

    onDragOver($event){
        event.preventDefault();
        event.stopPropagation();
    }

    onMouseDown(x, y){
        this.mouseClickHold = true;
        this.mouseClickedTrack = this.getTrackFromMouseY(y);
        this.mouseClickedTrackNode = this.getTracknodeFromMouse(x,y);
        this.mouseTrackNodeOffsetX = x - this.timeToOffsetX(this.mouseClickedTrackNode.starttime);
    }

    onMouseUp(x, y){
        this.mouseClickHold = false;
        if(this.mouseClickedTrackNode == null || this.mouseClickedTrack == null){
            return;
        }else{
            let starttime = this.getStartTimeFromMouseX(x - this.mouseTrackNodeOffsetX);
            if(this.mouseClickedTrackNode.starttime != starttime) {
                this.mouseClickedTrackNode.starttime = starttime;
                let track: Track = this.getTrackFromMouseY(y);
                if (track != null) {
                    this.swapTrackNodeToTrack(this.mouseClickedTrack, track, this.mouseClickedTrackNode);
                }
                this.onchange.emit({});
            }
            this.mouseClickedTrack = null;
            this.mouseClickedTrackNode = null;

        }
    }

    swapTrackNodeToTrack(fromTrack:Track, toTrack: Track, trackNode:TrackNode){
        let i = fromTrack.tracknodes.indexOf(trackNode);
        fromTrack.tracknodes.splice(i,1);
        toTrack.tracknodes.push(trackNode);
    }

    addSnippetToTrack(snippet: string, time:number, track: Track){
        this._dataService.getSnippetFromServer(snippet).subscribe(snippet => {
            track.tracknodes.push(new TrackNode(time, snippet.duration, snippet.id, snippet.name));
            this.onchange.emit({});    
        });
    }

    resize(){
        this.canvasHeight = this.tracks.length * this.trackHeight + this.rulerHeight;
        this.canvas.style.height = this.canvasHeight.toString() + 'px';
        this.canvas.style.width = this.canvasWidth.toString() + 'px';
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    // Utils
    private getStartTimeFromMouseX(x: number): number{
        //offset any left scrolling
        x += this.parentCanvas.scrollLeft;
        return Math.floor(x / this.quarterBeatGridWidth);
    }

    private getTrackFromMouseY(y: number) :Track{
        //offset the ruler
        y -= this.rulerHeight;

        //offset any down scrolling
        y += this.parentCanvas.scrollTop;
        let tracknum = Math.floor(y / this.trackHeight);
        if(tracknum >= this.tracks.length){
            return null;
        }
        return this.tracks[tracknum];
    }

    private getTracknodeFromMouse(x:number, y:number):TrackNode{

        let track: Track = this.getTrackFromMouseY(y);

        if(track == null){
            return null;
        }

        // Offset any left scrolling
        x += this.parentCanvas.scrollLeft;

        let wantedtracknode:TrackNode = null;
        for(var i = 0 ; i < track.tracknodes.length; i++){
            let tracknode = track.tracknodes[i];
            let startx = this.timeToOffsetX(tracknode.starttime);
            let durationx = this.timeToOffsetX(tracknode.duration);

            if(startx < x && x <= startx + durationx){
                wantedtracknode = tracknode;
            }
        }

        if(wantedtracknode == null) {
            return null;
        }else{
            return wantedtracknode;
        }
    }

    private timeToOffsetX(time){
        return time * this.quarterBeatGridWidth;
    }

    //UI Rendering
    renderTransportLine() {
        let beat = AudioEngineService.transportTimeToTick(Tone.Transport.position)
        let xpos = beat * this.quarterBeatGridWidth;
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'blue';
        this.renderLine(this.ctx, xpos, this.canvasTopY, xpos, this.canvasTopY + this.canvasHeight);
    }

    renderRuler(){
        let ypos = this.parentCanvas.scrollTop;
        this.renderBoxwithColor(this.ctx, this.canvasTopX, ypos, this.canvasWidth, this.rulerHeight, '#ffffcc');
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        //Draw Vertical Lines
        for(var i = 0; i < this.numGrids; i++){
            let xpos = (i + 1) * this.beatGridWidth
            this.ctx.lineWidth = 1.5;
            this.renderLine(this.ctx, xpos, ypos, xpos, ypos + this.rulerHeight);

            for(let j = 0; j < 3; j++){
                let sxpos = xpos - (j+1) * this.quarterBeatGridWidth;
                this.ctx.lineWidth = 1;
                this.renderLine(this.ctx, sxpos, ypos + this.rulerHeight/2, sxpos, ypos + this.rulerHeight);
            }
        }
    }

    renderTracks(){
        this.renderTimeGrid();
        for(let i = 0; i < this.tracks.length; i++){
            let ypos = i * this.trackHeight + this.rulerHeight;
            this.renderTrack(this.tracks[i], ypos);
        }
    }

    renderTrack(track: Track, ystart:number){

        //Render Box
        this.ctx.lineWidth = 2;
        this.renderLine(this.ctx, this.canvasTopX, ystart + this.trackHeight, this.canvasWidth, ystart+this.trackHeight);

        if(track.tracknodes == null){
            return;
        }

        //Render Snippets
        for(let i = 0; i < track.tracknodes.length; i++) {
            let tracknode: TrackNode = track.tracknodes[i];
            let startx = this.timeToOffsetX(tracknode.starttime);
            let durationx = this.timeToOffsetX(tracknode.duration);
            this.renderTracknode(this.ctx, tracknode.snippetname, startx + 1, ystart + 1, durationx - 2);
        }
    }

    renderPhantomTrackNode(){
        let xpos = this.mouseX - this.mouseTrackNodeOffsetX;
        let ypos = this.rulerHeight + Math.floor((this.mouseY - this.rulerHeight) / this.trackHeight) * this.trackHeight;
        let durationX = this.timeToOffsetX(this.mouseClickedTrackNode.duration);

        this.ctx.lineWidth = 0.8;
        this.renderBoxwithColor(this.ctx, xpos, ypos, durationX , this.trackHeight - 2, 'rgba(230, 49, 49, 0.75)');

        let snipy = ypos + 1 + this.snippetNameBarHeight;
        this.ctx.lineWidth = 0.6;
        this.renderLine(this.ctx, xpos, snipy, xpos + durationX, snipy);

        this.ctx.lineWidth = 0.4;
        this.renderText(this.ctx, name, xpos + 10, ypos + 2*(this.snippetNameBarHeight / 3));
    }

    renderTracknode(ctx:CanvasRenderingContext2D, name:string, startx:number, ystart:number, durationx:number){

        ctx.lineWidth = 0.8;
        this.renderBoxwithColor(ctx, startx, ystart, durationx, this.trackHeight - 2, 'red');

        let snipy = ystart + 1 + this.snippetNameBarHeight;
        ctx.lineWidth = 0.6;
        this.renderLine(ctx, startx, snipy, startx + durationx, snipy);

        ctx.lineWidth = 0.4;
        this.renderText(ctx, name, startx + 10, ystart + 2*(this.snippetNameBarHeight / 3));
    }

    renderTimeGrid(){
        this.renderBoxwithColor(this.ctx, this.canvasTopX, this.canvasTopY, this.canvasWidth, this.canvasHeight, 'lightgrey');
        for(let i = 0; i < this.numGrids; i++){
            let xpos = (i+1) * this.beatGridWidth;
            this.ctx.lineWidth = 0.5;
            this.renderLine(this.ctx, xpos, 0 , xpos, this.canvasHeight);

            for(let j = 0; j < 3; j++){
                let sxpos = xpos - (j+1) * this.quarterBeatGridWidth;
                this.ctx.lineWidth = 0.1;
                this.renderLine(this.ctx, sxpos, 0, sxpos, this.canvasHeight);
            }
        }
    }



    renderText(ctx: CanvasRenderingContext2D, str: string, x:number, y:number){
        ctx.fillStyle = 'black';
        ctx.fillText(str, x, y);
    }

    renderLine(ctx:CanvasRenderingContext2D, x1:number, y1:number, x2:number, y2:number){
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    renderBoxwithColor(ctx:CanvasRenderingContext2D, x: number, y:number, width:number, height:number, color:string){
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'black'
        ctx.stroke();
    }


}
