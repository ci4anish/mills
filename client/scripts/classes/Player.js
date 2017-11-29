
export class Player {
    constructor(gameRoom){
        this.gameRoom = gameRoom;
    }

    setup(playerInfo){
        this.score = 0;
        this.name = playerInfo.name;
        this.id = playerInfo.id;
        this.main = this.id === this.gameRoom.getPlayerId();
    }

    addScore(score, combo = 1){
        this.score += score * combo;
        console.log("Player", this.name);
        console.log("Score", this.score);
        console.log("Score total", score);
        console.log("Combo", combo > 1);
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
}
