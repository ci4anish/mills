import { Land } from "./Land";
import { Sky } from "./Sky";
import { Observable } from 'rxjs/Observable';
import { socket } from '../socket';
import { Cloud } from "./Cloud";
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GameScore } from "./GameScore";
import { Sun } from "./Sun";
import { MillsManager } from "./MillsManager";
import { Wind } from "./Wind";

export class GameRoom {
    constructor(){
        this.gameConnectionStream = new ReplaySubject(1);
    }

    createGame(){

        return Observable.create((observer) => {
            observer.next("Creating game");
            this.setUpElements();
            let config = { pathPoints: this.land.getPathPoints() };
            socket.emit("create-game", config);
            observer.next("Waiting for player2...");


            // observer.next(2);
            // observer.next(3);
            // setTimeout(() => {
            //     console.log("Destroy");
            //     this.land.destroy();
                // observer.next(4);
                // observer.complete();
            // }, 3000);
        });
    }

    setUpElements(pathPoints){
        this.land = new Land();
        this.sky = new Sky();
        this.clouds = [
            new Cloud({x: 50, y: 135}),
            new Cloud({x: 200, y: 50}),
            new Cloud({x: 400, y: 180}),
            new Cloud({x: 600, y: 250}),
            new Cloud({x: 1100, y: 80}),
            new Cloud({x: 900, y: 235}),
            new Cloud({x: 1200, y: 150}),
            new Cloud({x: -50, y: 166}),
            new Cloud({x: 1100, y: 300}),
            new Cloud({x: 500, y: 166}),
            new Cloud({x: 700, y: 400}),
            new Cloud({x: 800, y: 260}),
            new Cloud({x: 300, y: 370}),
            new Cloud({x: -750, y: 420}),
        ];
        this.gameScore = new GameScore();
        this.sun = new Sun(this);
        this.wind = new Wind();
        this.millsManager = new MillsManager(this);
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

    getGameConnectionStream(){
        return this.gameConnectionStream;
    }
}
