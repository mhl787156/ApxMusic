import {Injectable} from "@angular/core";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Snippet} from "../src/data-classes/snippet";

@Injectable()
export class SnippetDataService{

    private _urlServer = "http://apx.twintailsare.moe:80/api/";

    constructor(private _http:Http) {

    }

    // Posts a request for a new Snippet and returns the new snippet in an observable
    postNewSnippetToServer() : Observable<Snippet>{
        return this._http.post(this._urlServer + "snippet", "")
            .map(res => res.json());
    }


    // Gets the snippet from the server
    getSnippetFromServer(id: string) : Observable<Snippet>{
        console.log("Getting " + id + " from server");
        return this._http.get(this._urlServer + "snippet/" + id).map(res => res.json());
    }

    postSnippetMetaChangeToServer(snippet:Snippet) {
        console.log("Sending", JSON.stringify(snippet || null));
        return this._http.post(this._urlServer + "snippet/" + snippet.id + "/meta", JSON.stringify(snippet))
            .map(res => console.log("PostSNippetMetaResult", res));
    }

    postSnippetDeleteToServer(snippet: Snippet){
        console.log("Sending (deleteing)", JSON.stringify(snippet || null));
        return this._http.post(this._urlServer + "snippet/" + snippet.id + "/delete", JSON.stringify(snippet))
            .map(res => console.log("PostSnippetDeleteResult", res));
    }

    getAllUserSnippets() {
        return this._http.get(this._urlServer + "me/snippets").map(res => res.json());
    }
}
