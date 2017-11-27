import { screenHeight } from "../constants";
import { EventEmmiter } from "./EventEmmiter";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';


export class Wind extends EventEmmiter {
    constructor(){

        let randomConfigs = {
            eventPeriodicity: { min : 10000, max : 40000},
            eventTime: { min : 6000 ,max : 10000}
        };

        super(3, randomConfigs);
        this.maxPower = 200;

        this.eventStream = Observable.interval(40)
                            .map(() => this.powerKoef)
                            .multicast(() => new Subject())
                            .refCount();

        this.startEventChange();
    }

    getPowerInPoint(point){
        let scale = screenHeight / this.maxPower;
        return this.maxPower - point.y / scale;
    }
}

export const wind = new Wind();