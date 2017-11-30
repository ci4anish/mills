
export const WindListenerMixin = (superclass) => class extends superclass {
    getWindStream(){
        return this.gameRoom.getWind().getStream();
    }

    getWindEventChangeStream(){
        return this.gameRoom.getWind().getEventChangedStream();
    }

    listenToWind(){
        this.blowSubscription = this.getWindStream().subscribe(this.move.bind(this));
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