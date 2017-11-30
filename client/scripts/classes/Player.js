
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
        this.gameRoom.updateScoreBar(this.getId(), this.score, combo, true);
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
