import { mainContainer } from "../constants";

export class Sky {
    constructor(){
        this.color = "#e6f8ff";
        this.colorActive = "radial-gradient(ellipse at 170% 0%, rgba(255,213,140,1) 0%, rgba(255,239,212,1) 26%, rgba(252,240,221,1) 49%, rgba(230,248,255,1) 82%, rgba(230,248,255,1) 100%)";
    }

    draw(){
        this.element = document.createElement("DIV");
        this.element.id = "sky";
        this.element.style.top = 0;
        this.element.style.bottom = 0;
        this.element.style.right = 0;
        this.element.style.left = 0;
        this.element.style.margin = "auto";
        this.resetBackground();

        mainContainer.appendChild(this.element);
    }

    resetBackground(){
        this.element.style.background = this.color;
    }

    setActiveBackground(){
        this.element.style.background = this.colorActive;
    }
}

export let sky = new Sky();