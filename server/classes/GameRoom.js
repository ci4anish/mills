const Wind = require("./Wind");
const Sun = require("./Sun");
const MillsManager = require("./MillsManager");
const Player = require("./Player");
const RxSocketPair = require("./RxSocketPair");

const Subject = require('rxjs/Subject').Subject;
const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/fromEvent');
require('rxjs/add/observable/merge');

module.exports = class GameRoom {

    constructor(config, masterSocket){
        this.config = config;
        this.masterSocket = masterSocket;
        this.startGameListener = this.startGame.bind(this);
        this.id = 1;

    }

    setup(listenerSocket){
        this.listenerSocket = listenerSocket;
        this.wind = new Wind();
        this.sun = new Sun();
        this.millsManager = new MillsManager(this);
        this.createPlayers();
        this.setListeners();
        this.millsManager.listenToMillDestroy(this.millDestroyStream);
        let config = { pathPoints: this.config.pathPoints, playerId: this.playerListener.getId() };
        this.listenerSocket.emit("connect-game", config);
        this.masterSocket.emit("send-player-id", this.playerMaster.getId());
        this.gameStartedStream = new Subject();
        this.gameStartedStream.subscribe(this.startGameListener);
        this.setupFinished = true;

    }

    createPlayers(){
        this.playerMaster = new Player("Player1", this.generateId());
        this.playerListener = new Player("Player2", this.generateId());
    }

    setListeners(){
        this.windEventSubscription = this.wind.getEventStream().map(this.mapEvent).subscribe(this.emitEvent.bind(this));
        this.windEventChangeSubscription = this.wind.getEventChangeStream().map(this.mapEvent).subscribe(this.emitEvent.bind(this));
        this.sunEventSubscription = this.sun.getEventStream().map(this.mapEvent).subscribe(this.emitEvent.bind(this));
        this.sunEventChangeSubscription = this.sun.getEventChangeStream().map(this.mapEvent).subscribe(this.emitEvent.bind(this));
        let onConnected = () => {
            this.emitEvent({
                eName: "synchronize-game",
                event: {
                    player1: { name: this.playerMaster.getName(), id: this.playerMaster.getId() },
                    player2: { name: this.playerListener.getName(), id: this.playerListener.getId() }
                }
            });
            this.listenerSocket.removeListener("connected", onConnected);
            this.gameStartedStream.next();
        };
        this.listenerSocket.on("connected", onConnected);

        this.rxMasterSocketPair = new RxSocketPair(this.masterSocket, this.listenerSocket);
        this.rxMasterSocketPair.listenToEventAndEmit("mill-energy-gathered", (millConfig) => millConfig.posId);
        this.rxMasterSocketPair.listenToEventAndEmit("update-player-score", (info) => info);

        this.millDestroyStream = Observable.merge(
            Observable.fromEvent(this.masterSocket, "mill-destroy"),
            Observable.fromEvent(this.listenerSocket, "mill-destroy")
        );
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

    startGame(){
        this.millsManager.addMill(this.playerMaster.getId());
        this.millsManager.addMill(this.playerListener.getId());
        this.millsAddInterval = setInterval(() => {
            this.millsManager.addMill(this.playerMaster.getId());
            this.millsManager.addMill(this.playerListener.getId());
        }, 15000);
    }

    generateId(){
        return this.id++;
    }

    destroy(){
        this.emitEvent({ eName: "end-game" });
        clearInterval(this.millsAddInterval);
        if(this.setupFinished){
            this.windEventSubscription.unsubscribe();
            this.windEventChangeSubscription.unsubscribe();
            this.sunEventSubscription.unsubscribe();
            this.sunEventChangeSubscription.unsubscribe();
            this.gameStartedStream.unsubscribe();
            this.rxMasterSocketPair.destroy();
            this.wind.destroy();
            this.sun.destroy();
            this.millsManager.destroy();
            this.wind = undefined;
            this.sun = undefined;
            this.millsManager = undefined;
            this.rxMasterSocketPair = undefined;
        }
        this.setupFinished = false;
    }
};