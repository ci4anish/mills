
export class Player {
    constructor(gameRoom){
        this.gameRoom = gameRoom;
    }

    setup(name, id){
        this.score = 0;
        this.name = name;
        this.id = id;
        this.main = this.id === this.gameRoom.getPlayerId();
    }

    addScore(score){
        this.score += score;
    }

    getScore(){
        return this.score;
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    setMain(){
        this.main = true;
    }
}
