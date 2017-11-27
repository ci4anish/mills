import { screenHeight } from "../constants";
import { EventEmmiter } from "./EventEmmiter";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';


export class Wind extends EventEmmiter {
    constructor(){
        super();
        this.maxPower = 200;
        this.setServerListener();
    }

    getPowerInPoint(point){
        let scale = screenHeight / this.maxPower;
        return this.maxPower - point.y / scale;
    }
}

export const wind = new Wind();