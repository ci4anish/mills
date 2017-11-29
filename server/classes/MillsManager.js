const Utils = require("../utils");

module.exports = class MillsManager {
    constructor(gameRoom){
        this.availableIds = [];
        this.gameRoom = gameRoom;
        this.availablePositions = Utils.stringToMap(this.gameRoom.config.availablePositions);
    }

    addMill(playerId){
        if(this.availablePositions.size === 0){
            return false;
        }

        this.availableIds.splice(0, this.availableIds.length); //clear array

        // цикл по ключам
        for(let id of this.availablePositions.keys()) {
            this.availableIds.push(id);
        }

        let posId = this.availableIds[Utils.getRandomInt(0, this.availableIds.length - 1)];
        let position = this.availablePositions.get(posId);
        let millConfig = { posId, position, playerId };
        this.availablePositions.delete(posId);

        this.gameRoom.emitEvent({ eName: "add-mill", event: millConfig });
    }

    listenToMillDestroy(millDestroyStream){
        this.millDestroyStreamSubscription = millDestroyStream.subscribe(this.removeMill.bind(this))
    }

    removeMill(mill){
        this.availablePositions.set(mill.posId, mill.position);
    }

    destroy(){
        this.millDestroyStreamSubscription.unsubscribe();
    }
};