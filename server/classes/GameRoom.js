const Wind = require("./Wind");
const Sun = require("./Sun");

module.exports = class GameRoom {

    constructor(io, activeSockets){
        this.wind = new Wind();
        this.sun = new Sun();
        this.activeSockets = activeSockets;
        this.io = io;
        this.eventEmmiter = this.emitEvent.bind(this);
    }

    setup(){
        this.windEventSubscription = this.wind.getEventStream().map(this.mapEvent).subscribe(this.eventEmmiter);
        this.windEventChangeSubscription = this.wind.getEventChangeStream().map(this.mapEvent).subscribe(this.eventEmmiter);
        this.sunEventSubscription = this.sun.getEventStream().map(this.mapEvent).subscribe(this.eventEmmiter);
        this.sunEventChangeSubscription = this.sun.getEventChangeStream().map(this.mapEvent).subscribe(this.eventEmmiter);
    }

    mapEvent(event){
        let eName = event.name;
        delete event.name;
        return { eName, event }
    }

    emitEvent({ eName, event }){
        this.io.emit(eName, event);
    }

    destroy(){
        this.windEventSubscription.unsubscribe();
        this.windEventChangeSubscription.unsubscribe();
        this.sunEventSubscription.unsubscribe();
        this.sunEventChangeSubscription.unsubscribe();
    }
};