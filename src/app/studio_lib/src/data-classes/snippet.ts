import {Note, INote} from "./note";

export interface ISnippet{
    id: string;
    name:string;
    owner: string;
    public: boolean;
    duration: number;
}

export interface ISnippetContent{
    id:string;
    notes: INote[][];
    soundfile:string;
}

export class Snippet implements ISnippet{
    id:string;
    name:string;
    owner:string;
    public:boolean;
    duration: number;
}

export class SnippetContent implements ISnippetContent{
    id:string;
    notes:INote[][];
    soundfile:string;



	//Generate a list of pitch-duration-time pairs
	renderToArray(): [string[], string, string][] {
		let res:[string[], string, string][] = [];

        for (var i = 0; i < this.notes.length; ++i) {
            if(this.notes[i].length == 0){
                continue;
            }
			let filteredNotes = this.notes[i]
			let currentNotes = []
			while (filteredNotes.length > 0) {
				let nextDuration: string = filteredNotes[0].duration;
				currentNotes = filteredNotes.filter(function(note) {
					return note.duration != nextDuration;
				});
				filteredNotes = filteredNotes.filter(function(note) {
					return note.duration != nextDuration;
				});
				let pitches = currentNotes.map(function(note){return note.pitch;});
				let duration = nextDuration;
				let time = this.convertToTransportTime(i);

				res.push([pitches, duration, time]);
			}
        }

		return res;
	}

    convertToTransportTime(i: number):string{
        let startBars = Math.floor(i/16);
        let insideBar = i % 16;
        let startQuarters = Math.floor(insideBar/4);
        let startSixteenths = insideBar % 4;
        let startTime = startBars.toString() + ":" + startQuarters.toString() + ":" + startSixteenths.toString();
        return startTime;
    }

}
