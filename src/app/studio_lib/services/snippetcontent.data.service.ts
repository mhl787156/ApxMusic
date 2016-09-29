import {Injectable} from "@angular/core";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {SnippetContent} from "../src/data-classes/snippet";

declare var EventSource:any;

@Injectable()
export class SnippetContentDataService{

    private _urlServer = "http://apx.twintailsare.moe:80/api/";
    private eventSource: any;

    constructor(private _http:Http) {

    }

    //Subscribe to the connection.
    subscribeToSnippet(id:string): Observable<SnippetContent>{
        console.log("Subscribing to Snippet", id);
        return Observable.create(observer => {
            this.eventSource = new EventSource(this._urlServer + "snippetsub/" + id);

            this.eventSource.onopen = x => {
                console.log("SnippetContent Connection Open");
            };

            this.eventSource.onmessage = x => {
            };

            this.eventSource.onerror = x => {
                console.log("Snippet Subscription Error", x);
            };

            this.eventSource.addEventListener('update', x =>{
                observer.next(x.data);
            }, false);

            return () => {
                console.log("Server Closing Snippet Subscription ");
                this.eventSource.close()
            };

        }).map(res => JSON.parse(res));
    }
    
    closeSubsciptionToSnippet(){
        console.log("User Closing Snippet Subscription");
        if(this.eventSource != null) {
            this.eventSource.close();
        }
    }

    // Gets the project from the server
    getSnippetContentFromServer(id: string) : Observable<SnippetContent>{
        return this._http.get(this._urlServer + "snippetcontent/" + id).map(res => res.json());
    }


    postToServer(snippetcontent: SnippetContent) {
        return this._http.post(this._urlServer + "snippetcontent/" + snippetcontent.id, JSON.stringify(snippetcontent))
            .map(res => res);
    }
}
