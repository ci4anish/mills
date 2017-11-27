import { millParams, skyHeight, screenHeight, screenWidth, mainContainer, landColor, landPadding } from "../constants";
import Utils from "../utils"

export class Land {
    constructor(){
        this.size = {
            width: screenWidth,
            height: screenHeight - skyHeight
        };
        this.padding = landPadding;
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

    findAvailablePositions(){
        let landSize = land.getSize();
        let availHeight = landSize.height - this.padding * 2;
        let availWidth = landSize.width - this.padding * 2;
        let rowsCount = Math.floor(availHeight / millParams.millSize.height);
        let colsCount = Math.floor(availWidth / millParams.millSize.width);
        this.availablePositions = new Map();

        let x = this.padding;
        let y, id = 0;

        for (let rowIndex = 1; rowIndex <= rowsCount; rowIndex++){
            y = screenHeight - this.padding - rowIndex * millParams.millSize.height;

            for (let colIndex = 1; colIndex <= colsCount; colIndex++){
                if(this.isLandItem(x, y - millParams.millSize.height, millParams.millSize.width)){
                    this.availablePositions.set(id++, { x: x, y: y });
                }

                x += millParams.millSize.width;
            }

            x = this.padding;
        }
    }

    isLandItem(x, y, width){
        let landCanvas = land.getCanvas();
        let isLand = true;

        // Get the CanvasPixelArray from the given coordinates and dimensions.
        let imgd = landCanvas.getImageData(x, y, width, 1);
        let pix = imgd.data;

        // Loop over each pixel and invert the color.
        for (let i = 0, n = pix.length; i < n; i += 4) {
            if(pix[i] !== landColor.r || pix[i + 1] !== landColor.g || pix[i + 2] !== landColor.b ){
                isLand = false;
                break;
            }
        }

        return isLand;
    }

    setup(){
        this.draw();
        this.findAvailablePositions();
    }

    getAvailablePositions(){
        return this.availablePositions;
    }

    getCanvas(){
        return this.canvasContext;
    }

    getSize(){
        return this.size;
    }
}

export let land = new Land();