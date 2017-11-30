
export const SunListenerMixin = (superclass) => class extends superclass {
    getSunStream(){
        return this.gameRoom.getSun().getStream();
    }

    getSunEventChangeStream(){
        return this.gameRoom.getSun().getEventChangedStream();
    }

    listenToSun(){
        this.sunSubscription = this.getSunStream().subscribe(this.move.bind(this));
    }

    move(powerKoef){
        //implement this in children
    }

    unsubscribeFromSun(){
        this.sunSubscription.unsubscribe();
    }
};