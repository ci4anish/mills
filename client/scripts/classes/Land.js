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
        if(!this.pathPoints){
            this.pathPoints = this.calculatePathPoints();
        }

        let path = `M${this.pathPoints.startPoint.x} ${this.pathPoints.startPoint.y}
                    Q ${this.pathPoints.q.x} ${this.pathPoints.q.y}`;

        for(let i = 0; i < this.pathPoints.t.length; i++){
            path += `T ${this.pathPoints.t[i].x} ${this.pathPoints.t[i].y}`;
        }

        path += `V ${this.pathPoints.v1} H ${this.pathPoints.h} V ${this.pathPoints.v2}`;
        this.canvasContext = this.element.getContext('2d');
        this.canvasContext.fillStyle = `rgb(${landColor.r}, ${landColor.g}, ${landColor.b})`;
        this.canvasContext.fill(new Path2D(path));
        mainContainer.appendChild(this.element);
    }

    calculatePathPoints(){
        let withBetweenMountains = 100;
        let startPoint = {x: 0, y: this.size.height / 1.6};
        let pathPoints = {};
        pathPoints.startPoint = startPoint;
        pathPoints.q = {
            x: withBetweenMountains + " " + startPoint.y / 3,
            y: withBetweenMountains * 2 + " " + (startPoint.y / 2 + 100)
        };

        pathPoints.t = [];
        pathPoints.t.push({ x: withBetweenMountains * 4, y: startPoint.y / 2 });
        pathPoints.t.push({ x: withBetweenMountains * 6, y: startPoint.y / 2 + Utils.getRandomInt(0, 30) });
        pathPoints.t.push({ x: withBetweenMountains * 8, y: startPoint.y / 2 });
        pathPoints.t.push({ x: withBetweenMountains * 10, y: startPoint.y / 2 - Utils.getRandomInt(0, 30) });
        pathPoints.t.push({ x: withBetweenMountains * 12, y: startPoint.y / 2 });
        pathPoints.t.push({ x: withBetweenMountains * 14, y: startPoint.y / 2 + Utils.getRandomInt(0, 30) });
        pathPoints.t.push({ x: withBetweenMountains * 16, y: startPoint.y / 2 });
        pathPoints.t.push({ x: withBetweenMountains * 18, y: startPoint.y / 2 - Utils.getRandomInt(0, 30) });
        pathPoints.t.push({ x: withBetweenMountains * 20, y: startPoint.y / 2 });
        pathPoints.v1 = this.size.height;
        pathPoints.h = 0;
        pathPoints.v2 = startPoint.x;
        return pathPoints;
    }

    findAvailablePositions(){
        let landSize = this.getSize();
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
        let landCanvas = this.getCanvas();
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

    setup(pathPoints){
        this.pathPoints = pathPoints;
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

    getPathPoints(){
        return this.pathPoints;
    }

    destroy(){
        this.pathPoints = undefined;
        this.availablePositions = undefined;
        this.canvasContext = undefined;
        Utils.removeElement(this.element);
    }
}