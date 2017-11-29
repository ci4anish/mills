const EventEmmiter = require("./EventEmmiter");

const Subject = require('rxjs/Subject').Subject;

module.exports = class Sun extends EventEmmiter {
    constructor(){
        let randomConfigs = {
            eventPeriodicity: { min : 10000 ,max : 40000},
            eventTime: { min : 4000 ,max : 8000}
        };

        super(3, randomConfigs);
        this.eventStream = new Subject();
        this.params = {
            raysSpeedInterval: 100,
            raysSpeedActiveInterval: 30,
        };
        this.startEventChange();
    }

    sendEvent(activeMode){
        clearInterval(this.shineInterval);
        this.shineInterval = setInterval(() => {
            this.eventStream.next({ powerKoef: this.powerKoef, name: "Sun", active: activeMode });
        }, this.raysSpeedInterval);
    }


    onStartEventChange(){
        super.onStartEventChange();
        this.raysSpeedInterval = this.params.raysSpeedActiveInterval;
        this.sendEvent(true);
    }

    onStopEventChange(){
        super.onStopEventChange();
        this.raysSpeedInterval = this.params.raysSpeedInterval;
        this.sendEvent(false);
    }
};
