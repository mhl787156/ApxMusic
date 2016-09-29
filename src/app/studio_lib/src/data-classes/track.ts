
declare var Tone: any;
const POLY_VOICES = 12;

export interface ITrack{
    id: string;
    name: string;
    tracktype: string;
    volume: number
    solo: boolean;
    mute: boolean;
    instrument: any;
    tracknodes: ITrackNode[];
}

export interface ITrackNode{
    starttime: number;
    duration: number;
    snippetid: string;
    snippetname: string;
}


export class Track implements ITrack{
    id: string;
    name: string;
    tracktype: string;
    volume: number;
    solo: boolean;
    mute: boolean;
    instrument: string;
    tracknodes: TrackNode[];

    constructor(){
        this.id = Math.random().toString(36).slice(2);
        this.name = "newTrack";
        this.tracknodes = [];
        this.instrument = JSON.stringify(new Tone.PolySynth(POLY_VOICES, Tone.SimpleSynth).toMaster());
        this.solo = false;
        this.mute = false;
    }
}

export class TrackNode implements ITrackNode{
    starttime: number;
    duration: number;
    snippetid: string;
    snippetname:string;

    constructor(starttime, duration, snippetid, snippetname){
        this.starttime = starttime;
        this.duration = duration;
        this.snippetid = snippetid;
        this.snippetname = snippetname;
    }
    
	shiftTime(originalTime: string): string {
		let startSplit: string[] = originalTime.split(':');
		let startBars = parseInt(startSplit[0]);
		let startQuarters = parseInt(startSplit[1]);
		let startSixteenths = parseInt(startSplit[2]);

		let offsetSplit: string[] 	= [] //this.starttime.split(':');
		let offsetBars 				= 0  //parseInt(offsetSplit[0]);
		let offsetQuarters 			= 0  //parseInt(offsetSplit[1]);
		let offsetSixteenths 		= this.starttime //parseInt(offsetSplit[2]);

		let resSixteenths = (startSixteenths + offsetSixteenths);
		let resQuarters = (startQuarters + offsetQuarters + Math.floor(resSixteenths/4));
		let resBars = (startBars + offsetBars + Math.floor(resQuarters/4));
		resSixteenths = resSixteenths % 4;
		resQuarters = resQuarters % 4;
		
		let res = resBars.toString() + ":" + resQuarters.toString() + ":" + resSixteenths.toString();
		return res
	}
}
