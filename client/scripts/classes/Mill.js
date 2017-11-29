import { mainContainer, millParams } from "../constants";
import { select as d3Select } from "d3-selection";
import { line as d3Line } from "d3-shape";
import { EnergyGatherer } from "./EnergyGatherer";

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

export class Mill extends EnergyGatherer {
    constructor(manager){
        super();
        this.weight = millParams.weight;
        this.lineFunction = d3Line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });
        this.params = millParams;
        this.vCenter = this.params.millSize.height / 2;
        this.hCenter = this.params.millSize.width / 2;
        this.wingHeight = this.params.millSize.width / 4;
        this.wingWidth = this.params.millSize.width;
        this.manager = manager;
        this.gameRoom = manager.gameRoom;
        this.setPropertiesToDefault();

        this.energyStream = new Subject();
    }

    setup(millConfig){
        this.setPropertiesToDefault();
        this.posId = millConfig.posId;
        this.position = millConfig.position;
        this.isPlayers = millConfig.isPlayers;
        this.getWindPower(this.weight, this.position);
    }

    create() {
        this.draw();
        this.listenToSources();
        this.listenClickEvent();
        this.millDestroyedStreamSunscription = this.gameRoom.mainController.getMillDestroyedStream()
                                                .filter(posId => posId === this.posId)
                                                .subscribe(this.destroy.bind(this));
        this.allMillsDestroydStreamSunscription = this.gameRoom.mainController.getAllMillsDestroyStream()
                                                .subscribe(this.destroy.bind(this));
    }


    draw(){
        this.drawMillContainer();
        this.drawEnergyBar();
        this.drawMillBody();
        this.drawMillWinds();
    }

    listenClickEvent(){
        let bodyClickStream = Observable.fromEvent(this.millBody.node(), 'click');
        let hMillWingClickStream = Observable.fromEvent(this.hMillWing.node(), 'click');
        let vMillWingClickStream = Observable.fromEvent(this.vMillWing.node(), 'click');

        this.clickStreamSubscription = Observable.merge(bodyClickStream, hMillWingClickStream, vMillWingClickStream)
            .map(_event => {
                let comboFactor = 1;
                let energy;
                if(this.isPlayers){
                    energy = this.energy;
                }else{
                    comboFactor = 2;
                    energy = this.energy / comboFactor;
                }
                this.energy = 0;
                this.updateEnergyBar();
                return { energy, comboFactor };
            })
            .subscribe(this.energyStream);
    }

    drawMillContainer(){
        this.millContainer = d3Select(mainContainer).append("svg")
            .attr("class", "mill-container")
            .attr("style", `top: ${this.position.y}px; left: ${this.position.x}px`)
            .attr("width", this.params.millSize.width)
            .attr("height", this.params.millSize.height);
    }

    drawEnergyBar(){
        this.energyBar = this.millContainer.append("rect")
            .attr("x", 0).attr("y", 0)
            .attr("width", 0)
            .attr("height", 3)
            .style("fill", "red");
    }

    updateEnergyBar(){
        this.energyBar.attr("width", (this.energy * this.params.millSize.width) / this.maxEnergy);
    }

    drawMillBody(){
        const xStep = this.params.millSize.width / 5;
        let topYPoint = this.params.millSize.height / 3;
        let bottomYPoint = this.params.millSize.height;
        let millBodyData = [
            { "x": xStep * 2, "y": topYPoint },
            { "x": xStep * 3, "y": topYPoint },
            { "x": xStep * 4, "y": bottomYPoint },
            { "x": xStep, "y": bottomYPoint },
        ];
        this.millBody = this.millContainer.append("path")
            .attr("d", this.lineFunction(millBodyData) + " Z")
            .attr("fill", this.isPlayers ? this.params.millBodyPlayersColor : this.params.millBodyOpponentColor);
    }

    transformFn (deg) {
        return `translate(${this.hCenter}, ${this.vCenter - this.vCenter / 6}) 
                rotate(${deg})
                translate(-${this.wingWidth / 2}, -${this.wingHeight / 2})`;
    }

    rotateWing (wing, byDeg) {
        wing.attr("transform", this.transformFn(byDeg));
    }

    drawMillWinds(){

        let millWindData = [
            { "x": 0 , "y": 0 },
            { "x": this.hCenter, "y": this.wingHeight / 2 - this.wingHeight / 4 },
            { "x": this.wingWidth, "y": 0 },
            { "x": this.wingWidth, "y": this.wingHeight },
            { "x": this.hCenter, "y": this.wingHeight / 2 + this.wingHeight / 4  },
            { "x": 0, "y": this.wingHeight },
        ];

        this.hMillWing = this.millContainer.append("path")
            .attr("d", this.lineFunction(millWindData) + " Z")
            .attr("transform", this.transformFn(this.startDeg))
            .attr("fill", this.params.millWingColor);

        this.vMillWing = this.millContainer.append("path")
            .attr("d", this.lineFunction(millWindData) + " Z")
            .attr("transform", this.transformFn(this.startDeg + 90))
            .attr("fill", this.params.millWingColor);
    }

    move(powerKoef){
        this.startDeg += Math.floor(this.windPower * powerKoef);
        this.rotateWing(this.hMillWing, this.startDeg);
        this.rotateWing(this.vMillWing, this.startDeg + 90);
        this.energy += parseFloat((this.windPower * powerKoef / 70).toFixed(2));

        this.updateEnergyBar();

        if(this.energy >= this.maxEnergy){
            this.destroyWithEmit();
        }
    }

    destroy(){
        this.setPropertiesToDefault();
        this.millContainer.remove();
        this.clickStreamSubscription.unsubscribe();
        this.unsubscribeFromSources();
        this.manager.recycleMill(this);
        this.millDestroyedStreamSunscription.unsubscribe();
        this.allMillsDestroydStreamSunscription.unsubscribe();
    }

    destroyWithEmit(){
        this.destroy();
        if(this.isPlayers){
            this.gameRoom.mainController.emitEvent("mill-destroy", { position: this.position, posId: this.posId });
        }
    }

    setPropertiesToDefault(){
        this.startDeg = 0;
        this.energy = 0;
        this.posId = undefined;
        this.position = undefined;
        this.maxEnergy = 100;
    }
}