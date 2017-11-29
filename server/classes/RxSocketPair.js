const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/fromEvent');
require('rxjs/add/operator/map');

module.exports = class RxSocketPair{

    constructor(socket1, socket2){
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.subscriptionsPair = [];
    }

    listenToEventAndEmit(eName, mapFn){
        let eventSocket1Stream = Observable.fromEvent(this.socket1, eName);
        let eventSocket2Stream = Observable.fromEvent(this.socket2, eName);

        let eventSocket1Subscription = eventSocket1Stream.map(mapFn).subscribe((event) => {
            this.socket2.emit(eName, event);
        });
        let eventSocket2Subscription = eventSocket2Stream.map(mapFn).subscribe((event) => {
            this.socket1.emit(eName, event);
        });

        this.subscriptionsPair.push([eventSocket1Subscription, eventSocket2Subscription]);

        return [eventSocket1Stream, eventSocket2Stream];
    }

    destroy(){
        this.subscriptionsPair.forEach(pairSubscriptions => {
            pairSubscriptions.forEach(subscription => subscription.unsubscribe());
        });
        this.subscriptionsPair = undefined;
    }
};