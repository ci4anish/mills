import { screenHeight } from "../constants";
import { EventEmmiter } from "./EventEmmiter";
require('rxjs/add/operator/map');

export class Wind extends EventEmmiter {
    constructor(){
        super();
        this.maxPower = 200;
        this.setServerListener();
        this.socketEvent.map(e => e.powerKoef).subscribe(this.eventStream);
    }

    getPowerInPoint(point){
        let scale = screenHeight / this.maxPower;
        return this.maxPower - point.y / scale;
    }
}