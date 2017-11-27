const Utils = require("../utils");
const Subject = require('rxjs/Subject').Subject;

module.exports = class EventEmmiter {
    constructor(powerKoefActive, randomConfigs){
        this.resetPowerKoef();
        this.powerKoefActive = powerKoefActive;
        this.config = randomConfigs;
        this.eventChangeStream = new Subject();
    }

    getEventStream(){
        return this.eventStream;
    }

    getEventChangeStream(){
        return this.eventChangeStream;
    }

    startEventChange(){
        setTimeout(() => {
            this.powerKoef = this.powerKoefActive;
            this.onStartEventChange();
            this.stopEventChange().then(() => this.startEventChange());
        }, Utils.getRandomInt(this.config.eventPeriodicity.min, this.config.eventPeriodicity.max));
    }

    onStartEventChange(){ this.eventChangeStream.next({ name: this.constructor.name + " changed", changeStarted: true }); }

    stopEventChange(){
        return new Promise(resolve => {
            setTimeout(() => {
                this.resetPowerKoef();
                this.onStopEventChange();
                resolve();
            }, Utils.getRandomInt(this.config.eventTime.min, this.config.eventTime.max));
        });
    }

    onStopEventChange(){ this.eventChangeStream.next({ name: this.constructor.name + " changed", changeStarted: false }); }

    resetPowerKoef(){
        this.powerKoef = 1;
    }
};