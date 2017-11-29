import { Land } from "./Land";
import { Sky } from "./Sky";
import { Observable } from 'rxjs/Observable';
import { Cloud } from "./Cloud";
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GameScore } from "./GameScore";
import { Sun } from "./Sun";
import { MillsManager } from "./MillsManager";
import { Wind } from "./Wind";
import { Player } from "./Player";
import Utils from "../utils";

export class GameRoom {
    constructor(mainController){
        this.mainController = mainController;
        this.syncStream = new ReplaySubject(1);
    }

    createGame(){
        return Observable.create((observer) => {
            observer.next("Creating game");
            this.setUpElements();
            let config = {
                pathPoints: this.land.getPathPoints(),
                availablePositions: Utils.mapToString(this.land.getAvailablePositions())
            };
            this.mainController.emitEvent("create-game", config);
            observer.next("Waiting for player2...");
            this.syncStreamSubscription = this.syncStream.subscribe(() => {
                observer.complete();
            });
        });
    }

    setUpElements(pathPoints){
        this.land = new Land();
        this.sky = new Sky();
        this.wind = new Wind();
        this.clouds = [
            new Cloud({x: 50, y: 135}, this),
            new Cloud({x: 200, y: 50}, this),
            new Cloud({x: 400, y: 180}, this),
            new Cloud({x: 600, y: 250}, this),
            new Cloud({x: 1100, y: 80}, this),
            new Cloud({x: 900, y: 235}, this),
            new Cloud({x: 1200, y: 150}, this),
            new Cloud({x: -50, y: 166}, this),
            new Cloud({x: 1100, y: 300}, this),
            new Cloud({x: 500, y: 166}, this),
            new Cloud({x: 700, y: 400}, this),
            new Cloud({x: 800, y: 260}, this),
            new Cloud({x: 300, y: 370}, this),
            new Cloud({x: -750, y: 420}, this),
        ];
        this.gameScore = new GameScore();
        this.sun = new Sun(this);
        this.millsManager = new MillsManager(this);
        this.players = [new Player(this), new Player(this)];
        this.clouds.forEach(cloud => cloud.setup());
        this.sky.draw();
        this.land.setup(pathPoints);
        this.gameScore.draw();
        this.sun.setup();
        this.millsManager.setup();
    }

    getLand(){
        return this.land;
    }

    getSky(){
        return this.sky;
    }

    getWind(){
        return this.wind;
    }

    getSun(){
        return this.sun;
    }

    getSyncStream(){
        return this.syncStream;
    }

    onGameConnected(config){
        this.setUpElements(config.pathPoints);
        this.playerId = config.playerId;
        this.mainController.emitEvent("connected");
    }

    setPlayerId(id){
        this.playerId = id;
    }

    getPlayerId(){
        return this.playerId;
    }

    setUpPlayers(players){
        this.players[0].setup(players.player1);
        this.players[1].setup(players.player2);
        this.player = this.players.find(player => player.main);
    }

    getPlayer(){
        return this.player;
    }

    destroy(){
        this.land.destroy();
        this.sky.destroy();
        this.wind.destroy();
        this.gameScore.destroy();
        this.sun.destroy();
        this.millsManager.destroy();
        this.clouds.forEach(cloud => cloud.destroy());
        if(this.syncStreamSubscription){
            this.syncStreamSubscription.unsubscribe();
        }
    }

    onAddMill(millConfig){
        millConfig.isPlayers = this.playerId === millConfig.playerId;
        delete millConfig.playerId;
        this.millsManager.addMill(millConfig);
    }
}
