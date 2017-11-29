
export const SunListenerMixin = (superclass) => class extends superclass {
    getSunStream(){
        return this.gameRoom.getSun().getStream();
    }

    listenToSun(){
        this.sunSubscription = this.gameRoom.getSun().getStream().subscribe(this.move.bind(this));
    }

    move(powerKoef){
        //implement this in children
    }

    unsubscribeFromSun(){
        this.sunSubscription.unsubscribe();
    }
};