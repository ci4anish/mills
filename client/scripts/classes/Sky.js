import { mainContainer } from "../constants";
import Utils from "../utils";

export class Sky {
    constructor(){
        this.color = "#e6f8ff";
        this.colorActive = "radial-gradient(ellipse at 170% 0%, rgba(255,213,140,1) 0%, rgba(255,239,212,1) 26%, rgba(252,240,221,1) 49%, rgba(230,248,255,1) 82%, rgba(230,248,255,1) 100%)";
    }

    draw(){
        this.element = document.createElement("DIV");
        this.element.id = "sky";
        this.element.classList.add("full-screen");
        this.resetBackground();

        mainContainer.appendChild(this.element);
    }

    resetBackground(){
        this.element.style.background = this.color;
    }

    setActiveBackground(){
        this.element.style.background = this.colorActive;
    }

    destroy(){
        Utils.removeElement(this.element);
    }
}

export let sky = new Sky();