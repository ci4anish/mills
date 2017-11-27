import { wind } from "./Wind";

export const WindListenerMixin = (superclass) => class extends superclass {
    getWindStream(){
        return wind.getStream();
    }

    listenToWind(){
        this.blowSubscription = wind.getStream().subscribe(this.move.bind(this));
    }

    move(powerKoef){
        //implement this in children
    }

    unsubscribeFromWind(){
        this.blowSubscription.unsubscribe();
        this.windPower = undefined;
    }

    getWindPower(weight, position){
        this.windPower = wind.getPowerInPoint(position) / weight;
    }
};