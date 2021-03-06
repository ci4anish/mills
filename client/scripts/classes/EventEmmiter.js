import { socket } from "../socket";

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

export class EventEmmiter {
    constructor(){
        this.eventStream = new Subject();
        this.eventChangedStream = new Subject();
        this.eventChangeListener = this.onEventChanged.bind(this);
    }

    getStream(){
        return this.eventStream;
    }

    getEventChangedStream(){
        return this.eventChangedStream;
    }

    setServerListener(){
        this.socketEvent = Observable.fromEvent(socket, this.constructor.name);
        socket.on(this.constructor.name + " changed", this.eventChangeListener);
    }

    onEventChanged(e){
        this.eventChangedStream.next(e);
    }

    destroy(){
        socket.removeListener(this.constructor.name + " changed", this.eventChangeListener);
    }
}
