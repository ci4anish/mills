const Utils = require("../utils");

class Mill {
    constructor(count, manager){
        this.pull = [];
        for(let i = 0; i < count; i++){
            this.pull.push(new Mill(manager));
        }
    }
}

class MillsPull {
    constructor(count, manager){
        this.pull = [];
        for(let i = 0; i < count; i++){
            this.pull.push(new Mill(manager));
        }
    }
    get(){
        return this.pull.shift();
    }

    set(mill){
        return this.pull.push(mill);
    }

    getPull(){
        return this.pull;
    }
}

module.exports = class MillsManager {
    constructor(gameRoom){
        this.availableIds = [];
        this.gameRoom = gameRoom;
    }

    setup(){
        this.availablePositions = Utils.stringToMap(this.gameRoom.config.availablePositions);
        this.createPull();
    }

    createPull(){
        this.millsPull = new MillsPull(this.availablePositions.size, this);
    }

    addMill(){
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
        let mill = this.millsPull.get();
        mill.setup(position, posId);
        mill.create();
        this.availablePositions.delete(posId);

    }

    recycleMill(mill){
        this.availablePositions.set(mill.posId, mill.position);
        this.millsPull.set(mill);
    }
};