import { Mill } from "./Mill";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/scan';

class MillsPull {
    constructor(count, manager){
        this.pull = [];
        for(let i = 0; i < count; i++){
            this.pull.push(new Mill(manager));
        }
    }
    get(){
        return this.pull.shift();
    }

    set(mill){
        return this.pull.push(mill);
    }

    getPull(){
        return this.pull;
    }
}

export class MillsManager {
    constructor(gameRoom){
        this.gameRoom = gameRoom;
    }

    setup(){
        this.availablePositions = this.gameRoom.getLand().getAvailablePositions();
        this.createPull();
        this.subscribeOnClicks();
    }

    createPull(){
        this.millsPull = new MillsPull(this.availablePositions.size, this);
    }

    subscribeOnClicks(){
        let pull = this.millsPull.getPull();
        let streams = [];
        pull.forEach(millObject => {
            streams.push(millObject.energyStream);
        });
        let comboCounter = 1;

        this.clicksStreamSubscription = Observable.merge(...streams)
            .scan((last, current) => {
                last.shift();
                last.push(current);
                return last
            }, [{ energy: 0, comboFactor: 1 }, { energy: 0, comboFactor: 1 }, { energy: 0, comboFactor: 1 }])
            .subscribe(energies => {
                let energiesCopy = energies.slice();
                let lastThreeSum = energiesCopy.reduce((x, y) => x + y.energy * y.comboFactor, 0);
                energiesCopy.shift();
                let lastTwoSum = energiesCopy.reduce((x, y) => x + y.energy * y.comboFactor, 0);
                let lastClicked = energiesCopy[energiesCopy.length - 1];
                let score = Math.floor(lastClicked.energy);

                if(comboCounter === 1){
                    comboCounter = 2;
                    this.gameRoom.getPlayer().addScore(score);
                }else if(comboCounter === 2 && lastTwoSum < 180){
                    comboCounter = 2;
                    this.gameRoom.getPlayer().addScore(score);
                }else if(comboCounter === 2 && lastTwoSum >= 180){
                    comboCounter = 3;
                    this.gameRoom.getPlayer().addScore(score, 2);
                }else if(comboCounter === 3 && lastThreeSum < 270){
                    comboCounter = 1;
                    this.gameRoom.getPlayer().addScore(score);
                }else if(comboCounter === 3 && lastThreeSum >= 270){
                    comboCounter = 1;
                    this.gameRoom.getPlayer().addScore(score, 3);
                }

            });
    }

    addMill(millConfig){
        let mill = this.millsPull.get();
        mill.setup(millConfig);
        mill.create();
    }

    recycleMill(mill){
        this.millsPull.set(mill);
    }

    destroy(){
        this.millsPull = undefined;
        this.clicksStreamSubscription.unsubscribe();
    }
}