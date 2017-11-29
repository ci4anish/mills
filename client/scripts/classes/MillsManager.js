import { Mill } from "./Mill";
import Utils from "../utils"
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
        let comboCounter = 0;

        Observable.merge(...streams)
            .scan((last, current) => {
                last.shift();
                last.push(current);
                return last
            }, [0, 0, 0])
            .subscribe(energies => {
                let lastThreeSum = energies.reduce((x, y) => x + y);
                let lastClicked = energies[energies.length - 1];
                let score = Math.floor(lastClicked);

                if(Math.ceil(lastThreeSum) > 270 && comboCounter <= 0){
                    comboCounter = 2;
                    this.gameRoom.gameScore.setComboScore(score, 3);
                }else{
                    comboCounter--;
                    this.gameRoom.gameScore.setScore(score);
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
}