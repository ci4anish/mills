import { mainContainer } from "../constants";
import Utils from "../utils"

class ScoreField {
    constructor(labelText){
        this.field = document.createElement("DIV");
        let label = document.createElement("SPAN");
        label.innerText = labelText + ": ";
        this.valueField = document.createElement("SPAN");
        this.field.appendChild(label);
        this.field.appendChild(this.valueField);
        this.field.classList.add("player-score");
    }

    getElement(){
        return this.field;
    }

    updateValue(value){
        this.valueField.innerText = value;
    }

    setColor(color){
        this.field.style.color = color;
    }
}

export class GameScore {

    constructor(){
    }

    draw(){
        this.scoreBar = document.createElement("DIV");
        this.scoreBar.id = "score-bar";
        this.player1Score = new ScoreField("Player1");
        this.player2Score = new ScoreField("Player2");

        this.scoreBar.appendChild(this.player1Score.getElement());
        this.scoreBar.appendChild(this.player2Score.getElement());
        this.player1Score.updateValue(0);
        this.player2Score.updateValue(0);
        mainContainer.appendChild(this.scoreBar);
    }

    setComboScore(player, newScore, comboMultiplier){
        this[player + "SCore"].setColor("red");
        this.updateScoreBar(player, `${newScore} COMBO x${comboMultiplier}`);
        setTimeout(() => {
            this[player + "SCore"].setColor("black");
            this.updateScoreBar(player, newScore);
        }, 500);

    }

    setScore(player, newScore){
        this.updateScoreBar(player, newScore);
    }

    updateScoreBar(player, score){
        this[player + "SCore"].updateValue(score);
    }

    destroy(){
        Utils.removeElement(this.scoreBar);
    }
}
