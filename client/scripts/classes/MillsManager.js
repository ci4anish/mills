import { land } from "./Land";
import { gameScore } from "./GameScore";
import { Mill } from "./Mill";
import { millParams, screenHeight, landColor, landPadding } from "../constants";
import Utils from "../utils"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/scan';

class MillsPull {
    constructor(count, manager){
        this.pull = [];
        for(let i = 0; i < count; i++){
            this.pull.push(new Mill(manager));
        }
    }
    get(){
        return this.pull.shift();
    }

    set(mill){
        return this.pull.push(mill);
    }

    getPull(){
        return this.pull;
    }
}

export class MillsManager {
    constructor(){
        this.padding = landPadding;
        this.availableIds = [];
    }

    setup(){
        this.findAvailablePositions();
        this.createPull();
        this.subscribeOnClicks();
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

    createPull(){
        this.millsPull = new MillsPull(this.availablePositions.size, this);
    }

    subscribeOnClicks(){
        let pull = this.millsPull.getPull();
        let streams = [];
        pull.forEach(millObject => {
            streams.push(millObject.energyStream);
        });
        let comboCounter = 0;

        Observable.merge(...streams)
            .scan((last, current) => {
                last.shift();
                last.push(current);
                return last
            }, [0, 0, 0])
            .subscribe(energies => {
                let lastThreeSum = energies.reduce((x, y) => x + y);
                let lastClicked = energies[energies.length - 1];
                let score = Math.floor(lastClicked);

                if(Math.ceil(lastThreeSum) > 270 && comboCounter <= 0){
                    comboCounter = 2;
                    gameScore.setComboScore(score, 3);
                }else{
                    comboCounter--;
                    gameScore.setScore(score);
                }
            });
    }

    addMill(){
        if(this.availablePositions.size === 0){
            return false;
        }

        this.availableIds.splice(0, this.availableIds.length);

        // цикл по ключам
        for(let id of this.availablePositions.keys()) {
            this.availableIds.push(id);
        }

        let posId = this.availableIds[Utils.getRandomInt(0, this.availableIds.length - 1)];
        let position = this.availablePositions.get(posId);
        let mill = this.millsPull.get();
        mill.setup(position, posId);
        mill.create();
        this.availablePositions.delete(posId);

    }

    recycleMill(mill){
        this.availablePositions.set(mill.posId, mill.position);
        this.millsPull.set(mill);
    }
}

export let millsManager = new MillsManager();