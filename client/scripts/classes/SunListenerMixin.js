import { sun } from "./Sun";

export const SunListenerMixin = (superclass) => class extends superclass {
    getSunStream(){
        return sun.getStream();
    }

    listenToSun(){
        this.sunSubscription = sun.getStream().subscribe(this.move.bind(this));
    }

    move(powerKoef){
        //implement this in children
    }

    unsubscribeFromSun(){
        this.sunSubscription.unsubscribe();
    }
};