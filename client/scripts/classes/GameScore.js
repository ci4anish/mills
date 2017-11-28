import { mainContainer } from "../constants";
import Utils from "../utils"

export class GameScore {

    constructor(){
        this.score = 0;
    }

    draw(){
        this.scoreBar = document.createElement("DIV");
        this.scoreBar.id = "score-bar";
        this.updateScoreBar(this.score);
        mainContainer.appendChild(this.scoreBar);
    }

    setComboScore(newScore, comboMultiplier){
        this.setColor("red");
        this.score += (newScore * comboMultiplier);
        this.updateScoreBar(`${this.score} COMBO x${comboMultiplier}`);
        setTimeout(() => {
            this.setColor("black");
            this.updateScoreBar(this.score);
        }, 500);

    }

    setColor(color){
        this.scoreBar.style.color = color;
    }

    setScore(newScore){
        this.score += newScore;
        this.updateScoreBar(this.score);
    }

    updateScoreBar(score){
        this.scoreBar.innerText = score;
    }

    destroy(){
        Utils.removeElement(this.scoreBar);
    }
}
