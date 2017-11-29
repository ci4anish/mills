import { socket } from "../socket";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
require('rxjs/add/observable/fromEvent');

export class EventEmmiter {
    constructor(){
        this.eventStream = new Subject();
        this.eventChangeListener = this.onEventChanged.bind(this);
    }

    getStream(){
        return this.eventStream;
    }

    setServerListener(){
        this.socketEvent = Observable.fromEvent(socket, this.constructor.name);
        socket.on(this.constructor.name + " changed", this.eventChangeListener);
    }

    onEventChanged(e){}

    destroy(){
        socket.removeListener(this.constructor.name + " changed", this.eventChangeListener);
    }
}