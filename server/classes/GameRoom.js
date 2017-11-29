const Wind = require("./Wind");
const Sun = require("./Sun");

class Player {
    constructor(socket, name, id){
        this.score = 0;
        this.socket = socket;
        this.name = name;
        this.id = id;
    }

    addScore(score){
        this.score += score;
    }

    getScore(){
        return this.score;
    }
}

module.exports = class GameRoom {

    constructor(config, masterSocket){
        this.config = config;
        this.masterSocket = masterSocket;
        this.eventEmmiter = this.emitEvent.bind(this);
        this.id = 1;

    }

    setup(listenerSocket){
        this.listenerSocket = listenerSocket;
        this.wind = new Wind();
        this.sun = new Sun();
        this.createPlayers();
        this.setListeners();
        this.listenerSocket.emit("connect-game", this.config);

    }

    createPlayers(){
        this.player1 = new Player(this.masterSocket, "Player1", this.generateId());
        this.player2 = new Player(this.listenerSocket, "Player2", this.generateId());
    }

    setListeners(){
        this.windEventSubscription = this.wind.getEventStream().map(this.mapEvent).subscribe(this.eventEmmiter);
        this.windEventChangeSubscription = this.wind.getEventChangeStream().map(this.mapEvent).subscribe(this.eventEmmiter);
        this.sunEventSubscription = this.sun.getEventStream().map(this.mapEvent).subscribe(this.eventEmmiter);
        this.sunEventChangeSubscription = this.sun.getEventChangeStream().map(this.mapEvent).subscribe(this.eventEmmiter);
        let onConnected = () => {
            this.emitEvent({ eName: "synchronize-game" });
            this.listenerSocket.removeListener("connected", onConnected);
        };
        this.listenerSocket.on("connected", onConnected)
    }

    mapEvent(event){
        let eName = event.name;
        delete event.name;
        return { eName, event }
    }

    emitEvent({ eName, event }){
        this.listenerSocket.emit(eName, event);
        this.masterSocket.emit(eName, event);
    }

    destroy(){
        this.emitEvent({ eName: "end-game" });
        this.windEventSubscription.unsubscribe();
        this.windEventChangeSubscription.unsubscribe();
        this.sunEventSubscription.unsubscribe();
        this.sunEventChangeSubscription.unsubscribe();
        this.wind.destroy();
        this.sun.destroy();
    }

    generateId(){
        return this.id++;
    }
};