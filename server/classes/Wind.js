const EventEmmiter = require("./EventEmmiter");
const Observable = require('rxjs/Observable').Observable;
const Subject = require('rxjs/Subject').Subject;
require('rxjs/add/observable/interval');
require('rxjs/add/operator/map');
require('rxjs/add/operator/multicast');


class Wind extends EventEmmiter {
    constructor(){

        let randomConfigs = {
            eventPeriodicity: { min : 10000, max : 40000},
            eventTime: { min : 6000 ,max : 10000}
        };

        super(3, randomConfigs);
        this.maxPower = 200;
        this.activeMode = false;

        this.eventStream = Observable.interval(40)
                            .map(() => { return { powerKoef: this.powerKoef, name: "Wind", active: this.activeMode }})
                            .multicast(() => new Subject())
                            .refCount();

        this.startEventChange();
    }

    onStartEventChange(){
        super.onStartEventChange();
        this.activeMode = true;
    }

    onStopEventChange(){
        super.onStopEventChange();
        this.activeMode = false;
    }
}

const wind = new Wind();
module.exports = wind;