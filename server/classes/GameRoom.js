const Wind = require("./Wind");
const Sun = require("./Sun");
const MillsManager = require("./MillsManager");
const Player = require("./Player");


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
        //this.millsManager = new MillsManager(this);
        this.createPlayers();
        this.setListeners();
        let config = { pathPoints: this.config.pathPoints, playerId: this.playerListener.getId() };
        this.listenerSocket.emit("connect-game", config);
        this.masterSocket.emit("send-player-id", this.playerMaster.getId());

    }

    createPlayers(){
        this.playerMaster = new Player("Player1", this.generateId());
        this.playerListener = new Player("Player2", this.generateId());
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