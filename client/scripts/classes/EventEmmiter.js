import { socket } from "../socket";
import { Subject } from 'rxjs/Subject';

export class EventEmmiter {
    constructor(){
        this.eventStream = new Subject();
    }

    getStream(){
        return this.eventStream;
    }

    setServerListener(){
        socket.on(this.constructor.name, this.onEvent.bind(this));
        socket.on(this.constructor.name + " changed", this.onEventChanged.bind(this));
    }

    onEvent(e){
        this.eventStream.next(e.powerKoef);
    }

    onEventChanged(e){}
}