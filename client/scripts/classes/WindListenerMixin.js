import { mainController } from "./MainController";

export const WindListenerMixin = (superclass) => class extends superclass {
    getWindStream(){
        return mainController.gameRoom.wind.getStream();
    }

    listenToWind(){
        this.blowSubscription = mainController.gameRoom.wind.getStream().subscribe(this.move.bind(this));
    }

    move(powerKoef){
        //implement this in children
    }

    unsubscribeFromWind(){
        this.blowSubscription.unsubscribe();
        this.windPower = undefined;
    }

    getWindPower(weight, position){
        this.windPower = mainController.gameRoom.wind.getPowerInPoint(position) / weight;
    }
};