
export const WindListenerMixin = (superclass) => class extends superclass {
    getWindStream(){
        return this.gameRoom.getWind().getStream();
    }

    listenToWind(){
        this.blowSubscription = this.gameRoom.getWind().getStream().subscribe(this.move.bind(this));
    }

    move(powerKoef){
        //implement this in children
    }

    unsubscribeFromWind(){
        this.blowSubscription.unsubscribe();
        this.windPower = undefined;
    }

    getWindPower(weight, position){
        this.windPower = this.gameRoom.getWind().getPowerInPoint(position) / weight;
    }
};