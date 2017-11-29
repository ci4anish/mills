
module.exports = class Player {
    constructor(name, id){
        this.score = 0;
        this.name = name;
        this.id = id;
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
}
