import { mainContainer } from "../constants";
import Utils from "../utils"

class ScoreField {
    constructor(playeId, playerName){
        this.playeId = playeId;
        this.field = document.createElement("DIV");
        let label = document.createElement("SPAN");
        label.innerText = playerName + ": ";
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
        this.scoreBar = document.createElement("DIV");
        this.scoreBar.id = "score-bar";
        mainContainer.appendChild(this.scoreBar);
        this.playersScoreBars = [];
    }

    drawPlayersScores(players){
        players.forEach(player => {
            let bar = new ScoreField(player.getId(), player.getName());
            this.scoreBar.appendChild(bar.getElement());
            bar.updateValue(0);
            this.playersScoreBars.push(bar);
        });
    }

    setComboScore(playerId, newScore, comboMultiplier){
        let bar = this.playersScoreBars.find(bar => bar.playeId === playerId);
        bar.setColor("red");
        this.updateScoreBar(bar, `${newScore} COMBO x${comboMultiplier}`);
        setTimeout(() => {
            bar.setColor("black");
            this.updateScoreBar(bar, newScore);
        }, 500);

    }

    setScore(playerId, newScore){
        let bar = this.playersScoreBars.find(bar => bar.playeId === playerId);
        this.updateScoreBar(bar, newScore);
    }

    updateScoreBar(bar, score){
        bar.updateValue(score);
    }

    destroy(){
        Utils.removeElement(this.scoreBar);
    }
}
