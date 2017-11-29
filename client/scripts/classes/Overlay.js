import { mainContainer, screenHeight } from "../constants";
import { Observable } from 'rxjs/Observable';
require('rxjs/add/observable/fromEvent');

export class Overlay{

    constructor() {
        this.draw();
        this.btnClickStream = Observable.fromEvent(this.createGameBtn, "click");
    }

    draw(){
        this.overlay = document.createElement("DIV");
        this.overlay.id = "overlay";
        this.createGameBtn = document.createElement("BUTTON");
        this.createGameBtn.id = "create-game-btn";
        this.createGameBtn.innerText = "Create game";
        this.textField = document.createElement("SPAN");
        this.textField.id = "overlay-text";
        this.textField.style.display = "none";

        this.overlay.appendChild(this.createGameBtn);
        this.overlay.appendChild(this.textField);
        mainContainer.appendChild(this.overlay);
    }

    toTextMode(){
        this.createGameBtn.style.display = "none";
        this.textField.style.display = "inline-block";
    }

    toBtnMode(){
        this.createGameBtn.style.display = "inline-block";
        this.textField.style.display = "none";
    }

    getBtnClickStream(){
        return this.btnClickStream;
    }

    setTextField(text){
        this.textField.innerText = text;
    }

    close(){
        this.overlay.style.top = -screenHeight + "px";
    }

    open(){
        this.overlay.style.top = 0;
    }
}