import { Land } from "./Land";
import { Sky } from "./Sky";
import { Cloud } from "./Cloud";
import { GameScore } from "./GameScore";
import { Sun } from "./Sun";
import { MillsManager } from "./MillsManager";
import { Wind } from "./Wind";
import { Player } from "./Player";
import { EnergyGatherer } from "./EnergyGatherer";
import Utils from "../utils";

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export class GameRoom extends EnergyGatherer{
    constructor(mainController){
        super();
        this.mainController = mainController;
        this.syncStream = new ReplaySubject(1);
        this.gameRoom = this;
    }

    createGame(){
        return Observable.create((observer) => {
            observer.next("Creating game");
            this.prepareGame();
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

    prepareGame(){
        this.setUpElements();
        this.listenToSourcesEventChange();
    }

    energyEventChange(e){
        // I can use this to implement add scores to player who press key first on event change
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
        this.prepareGame(config.pathPoints);
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
        this.gameScore.drawPlayersScores(this.players);
    }

    getPlayer(){
        return this.player;
    }

    updateScoreBar(playerId, score, combo, emit){
        if(emit){
            this.mainController.emitEvent("update-player-score", { playerId, score, combo });
        }
        if(combo > 1){
            this.gameScore.setComboScore(playerId, score, combo);
        }else{
            this.gameScore.setScore(playerId, score);
        }
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
