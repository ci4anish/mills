import { mainController } from "./MainController";

export const SunListenerMixin = (superclass) => class extends superclass {
    getSunStream(){
        return mainController.gameRoom.getSun().getStream();
    }

    listenToSun(){
        this.sunSubscription = mainController.gameRoom.getSun().getStream().subscribe(this.move.bind(this));
    }

    move(powerKoef){
        //implement this in children
    }

    unsubscribeFromSun(){
        this.sunSubscription.unsubscribe();
    }
};