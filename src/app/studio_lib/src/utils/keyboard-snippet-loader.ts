import {Snippet} from "../data-classes/snippet";

export class KeyboardSnippetLoader{
    /*
        This singleton class is for interfacing between the
        snippetComponent and the keyboardInputComponent.

        connection has been implemented in the form of call backs
     */
    private kiCallback;
    private durationCallback;

    static instance:KeyboardSnippetLoader;
    static isCreating:Boolean = false;

    constructor() {
        if (!KeyboardSnippetLoader.isCreating) {
            throw new Error("You can't call new in Singleton instances!");
        }
    }

    callCallback(duration){
        if(this.durationCallback != null){
            this.durationCallback(duration);
        }
    }

    setKICallback(callBack: Function){
        this.kiCallback = callBack;
    }

    setNotes(snippet:Snippet, p:(duration)=>any = null){
        if(this.kiCallback != null){
            this.kiCallback(snippet);
        }
        this.durationCallback = p;
    }

    static getInstance() {
        if (KeyboardSnippetLoader.instance == null) {
            KeyboardSnippetLoader.isCreating = true;
            KeyboardSnippetLoader.instance = new KeyboardSnippetLoader();
            KeyboardSnippetLoader.isCreating = false;
        }

        return KeyboardSnippetLoader.instance;
    }

}