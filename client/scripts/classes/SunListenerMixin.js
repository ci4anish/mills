import { mainController } from "./MainController";

export const SunListenerMixin = (superclass) => class extends superclass {
    getSunStream(){
        return mainController.gameRoom.sun.getStream();
    }

    listenToSun(){
        this.sunSubscription = mainController.gameRoom.sun.getStream().subscribe(this.move.bind(this));
    }

    move(powerKoef){
        //implement this in children
    }

    unsubscribeFromSun(){
        this.sunSubscription.unsubscribe();
    }
};