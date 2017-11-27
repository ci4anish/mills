import { socket } from "../socket";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
require('rxjs/add/observable/fromEvent');

export class EventEmmiter {
    constructor(){
        this.eventStream = new Subject();
    }

    getStream(){
        return this.eventStream;
    }

    setServerListener(){
        this.socketEvent = Observable.fromEvent(socket, this.constructor.name);
        socket.on(this.constructor.name + " changed", this.onEventChanged.bind(this));
    }

    onEventChanged(e){}
}