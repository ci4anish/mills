import { mainContainer, screenWidth } from "../constants";
import { WindListenerMixin } from "./WindListenerMixin";
import { mix } from "./Mixin";
import Utils from "../utils"

export class Cloud extends mix(class Listener {}).with(WindListenerMixin){

    constructor(pos, gameRoom) {
        super();
        this.position = pos;
        this.gameRoom = gameRoom;
        this.type = Cloud.types[Utils.getRandomInt(0, Cloud.types.length - 1)];
        this.priority = Cloud.drawPriorities[Utils.getRandomInt(0, 1)];
        this.getWindPower(this.type.weight, pos);
    }

    draw(){
        let parts = `<div class="first-part part"></div>
                    <div class="second-part part"></div>
                    <div class="third-part part"></div>
                    <div class="forth-part part"></div>`;

        this.element = document.createElement("DIV");
        this.element.classList.add("cloud");
        this.element.classList.add(this.type.class);
        this.element.style.zIndex = this.priority;
        this.element.innerHTML = parts;
        this.addPositionStyles();
        mainContainer.appendChild(this.element);
    }

    move(powerKoef){
        this.position.x += this.windPower * powerKoef;
        if (this.position.x < (screenWidth + 30)) {
            this.addPositionStyles();
        }else{
            this.position.x = -180;
            this.position.y = Utils.getRandomInt(this.position.y - 10, this.position.y + 10);
            this.addPositionStyles();
        }
    }

    addPositionStyles(){
        this.element.style.left = this.position.x + "px";
        this.element.style.top = this.position.y + "px";
    }

    setup(){
        this.draw();
        this.listenToWind();
    }

    destroy(){
        this.unsubscribeFromWind();
        Utils.removeElement(this.element);
    }
}

Cloud.types = [{ class: "small", weight: 150 }, { class: "medium", weight: 220 }, { class: "large", weight: 300 }];
Cloud.drawPriorities = [5, 30]; // 5 - behind land, 30 - on top