import { skyHeight, screenHeight, screenWidth, mainContainer, landColor } from "../constants";
import Utils from "../utils"

export class Land {
    constructor(){
        this.size = {
            width: screenWidth,
            height: screenHeight - skyHeight
        };
    }

    draw(){
        this.element = document.createElement("CANVAS");
        this.element.id = "land";
        this.element.style.top = skyHeight + "px";
        this.element.setAttribute("width", this.size.width + "px");
        this.element.setAttribute("height", this.size.height + "px");
        let startPoint = {x: 0, y: this.size.height / 1.6};
        let withBetweenMountains = 100;
        let path = `M${startPoint.x} ${startPoint.y}
        Q ${withBetweenMountains} ${startPoint.y / 3} ${withBetweenMountains * 2} ${startPoint.y / 2 + 100}
        T ${withBetweenMountains * 4} ${startPoint.y / 2}
        T ${withBetweenMountains * 6} ${startPoint.y / 2 + Utils.getRandomInt(0, 30)}
        T ${withBetweenMountains * 8} ${startPoint.y / 2}
        T ${withBetweenMountains * 10} ${startPoint.y / 2 - Utils.getRandomInt(0, 30)}
        T ${withBetweenMountains * 12} ${startPoint.y / 2}
        T ${withBetweenMountains * 14} ${startPoint.y / 2 + Utils.getRandomInt(0, 30)}
        T ${withBetweenMountains * 16} ${startPoint.y / 2}
        T ${withBetweenMountains * 18} ${startPoint.y / 2 - Utils.getRandomInt(0, 30)}
        T ${withBetweenMountains * 20} ${startPoint.y / 2}
        V ${this.size.height} H 0 V ${startPoint.x}`;
        this.canvasContext = this.element.getContext('2d');
        this.canvasContext.fillStyle = `rgb(${landColor.r}, ${landColor.g}, ${landColor.b})`;
        this.canvasContext.fill(new Path2D(path));
        mainContainer.appendChild(this.element);
    }

    getCanvas(){
        return this.canvasContext;
    }

    getSize(){
        return this.size;
    }
}

export let land = new Land();