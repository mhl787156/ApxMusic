import {Injectable, NgZone} from "@angular/core";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ProjectContent} from "../src/data-classes/project-content";

declare var EventSource:any;

@Injectable()
export class ProjectContentDataService{

    private _urlServer = "http://apx.twintailsare.moe:80/api/";


    constructor(private _http:Http) {

    }

    //Subscribe to the connection.
    subscribeToProject(id:string): Observable<ProjectContent>{
        console.log("Subscribing to Project", id);
        return Observable.create(observer => {
            let eventSource = new EventSource(this._urlServer + "projectsub/" + id);

            eventSource.onopen = x => {
                console.log("connection open" , x);
            };


            eventSource.onmessage = x => {
                console.log("message" , x);
                observer.next(x.data);
            };

            eventSource.onerror = x => {
                console.log("ERRROROROROR", x);
            }

            eventSource.addEventListener('update', x =>{
                observer.next(x.data);
            }, false);

        }).map(res => JSON.parse(res));
    }

    // Gets the project from the server
    getProjectContentFromServer(pid: string) : Observable<ProjectContent>{
        console.log("Getting from server: projectcontent/" + pid);
        return this._http.get(this._urlServer + "projectcontent/" + pid).map(res => res.json());
    }


    postProjectContentToServer(projectContent:ProjectContent) {
        console.log("Sending project Content to Server", projectContent);
        return this._http.post(this._urlServer + "projectcontent/" + projectContent.id, JSON.stringify(projectContent))
            .map(res => console.log("Post ressult", res)/*res.json()*/);
    }
}
