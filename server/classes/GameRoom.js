const Wind = require("./Wind");
const Sun = require("./Sun");

class Player {
    constructor(socket, name){
        this.score = 0;
        this.socket = socket;
        this.name = name;
    }

    addScore(score){
        this.score += score;
    }

    getScore(){
        return this.score;
    }
}

module.exports = class GameRoom {

    constructor(io, config, masterSocket){
        this.config = config;
        this.io = io;
        this.masterSocket = masterSocket;
        this.eventEmmiter = this.emitEvent.bind(this);
    }

    setup(listenerSocket){
        this.listenerSocket = listenerSocket;
        this.player1 = new Player(this.masterSocket, "Player1");
        this.player2 = new Player(this.listenerSocket, "Player2");
        this.wind = new Wind();
        this.sun = new Sun();
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
        this.wind.destroy();
        this.sun.destroy();
    }
};