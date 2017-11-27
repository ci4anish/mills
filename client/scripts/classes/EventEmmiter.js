import Utils from "../utils"

export class EventEmmiter {
    constructor(powerKoefActive, randomConfigs){
        this.resetPowerKoef();
        this.powerKoefActive = powerKoefActive;
        this.config = randomConfigs;
    }

    getStream(){
        return this.eventStream;
    }

    startEventChange(){
        setTimeout(() => {
            this.powerKoef = this.powerKoefActive;
            this.onStartEventChange();
            this.stopEventChange().then(() => this.startEventChange());
        }, Utils.getRandomInt(this.config.eventPeriodicity.min, this.config.eventPeriodicity.max));
    }

    onStartEventChange(){}

    stopEventChange(){
        return new Promise(resolve => {
            setTimeout(() => {
                this.resetPowerKoef();
                this.onStopEventChange();
                resolve();
            }, Utils.getRandomInt(this.config.eventTime.min, this.config.eventTime.max));
        });
    }

    onStopEventChange(){}

    resetPowerKoef(){
        this.powerKoef = 1;
    }
}