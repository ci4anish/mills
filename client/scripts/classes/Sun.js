import { mainContainer, sunParams, screenWidth } from "../constants";
import { select as d3Select } from "d3-selection";
import { EventEmmiter } from "./EventEmmiter";
import { sky } from "./Sky";

export class SunRays {

    constructor(initialWidth, initialSpeed, startDeg, transformOffsets, sun){
        this.sun = sun;
        this.rays = [];
        this.width = initialWidth;
        this.speed = initialSpeed;
        this.startDeg = startDeg;
        this.transformOffsets = transformOffsets;
        this.height = 1;
        this.maxDeg = 360;
        this.degStep = 60;
    }

    drawRays(){
        for(let deg = this.startDeg; deg < this.maxDeg + this.startDeg; deg+= this.degStep){
            let ray = this.sun.sunRaysBackground.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("class", "sun-ray")
                .attr("width", this.width)
                .attr("height", this.height)
                .attr("transform", this.transformFn(deg, this.transformOffsets.initial))
                .style("fill", this.sun.color);

            this.rays.push(ray);
        }
    }

    redrawRays(offset){
        for(let deg = this.startDeg, index = 0; deg < this.maxDeg + this.startDeg; deg+= this.degStep, index++){
            this.rays[index]
                .attr("width", this.width)
                .attr("transform", this.transformFn(deg, offset));
        }
    }

    transformFn (deg, offset) {
        return `translate(${this.sun.sunRaysBackgroundSize / 2}, ${this.sun.sunRaysBackgroundSize / 2}) 
                rotate(${deg})
                translate(${offset}, -${this.height / 2})`;
    }

    animateRays(){
        this.width += this.speed;

        this.rays.forEach(ray => {
            ray.attr("width", this.width);
        });

        if(this.width === 0){
            this.speed = -this.speed;
            this.redrawRays(this.transformOffsets.andAnimation);
        }else if(this.width === 90){
            this.speed = -this.speed;
            this.redrawRays(this.transformOffsets.beginAnimation);
        }
    }

    changeRaysColor(){
        for(let deg = this.startDeg, index = 0; deg < this.maxDeg + this.startDeg; deg+= this.degStep, index++){
            this.rays[index].style("fill", this.sun.color);
        }
    }
}

export class Sun extends EventEmmiter {
    constructor(){
        super();
        this.params = sunParams;
        let offset = 50;
        this.position = { x: screenWidth - (offset + this.params.size), y: offset };
        this.sunRaysBackgroundSize = this.params.size * 5;
        this.sunRaysBackgroundPosition = {
            x: screenWidth - (this.sunRaysBackgroundSize / 2 + offset + this.params.size / 2),
            y: offset + this.params.size / 2 - this.sunRaysBackgroundSize / 2
        };
        this.color = this.params.color;
    }

    setup(){
        this.draw();
        this.setServerListener();
    }

    onEvent(e){
        // console.log("onEvent");
        if(e.active){
            this.eventStream.next(e.powerKoef);
        }

        this.shine(e.active);
    }

    draw(){
        this.drawBody();
        this.drawSunRaysBackground();
        this.drawSunRays();
    }

    drawBody(){
        this.body = document.createElement("DIV");
        this.body.id = "sun";
        this.body.style.width = this.params.size + "px";
        this.body.style.height = this.params.size + "px";
        this.body.style.backgroundColor = this.color;
        this.body.style.left = this.position.x + "px";
        this.body.style.top = this.position.y + "px";
        mainContainer.appendChild(this.body);
    }

    drawSunRaysBackground(){
        this.sunRaysBackground = d3Select(mainContainer).append("svg")
            .attr("id", "sun-rays-background")
            .attr("style", `top: ${this.sunRaysBackgroundPosition.y}px; left: ${this.sunRaysBackgroundPosition.x}px`)
            .attr("width", this.sunRaysBackgroundSize)
            .attr("height", this.sunRaysBackgroundSize);
    }

    drawSunRays(){
        this.sunRaysOuter = new SunRays(60, -3, 20, { initial: -150, beginAnimation: -150, andAnimation: 60 }, this);
        this.sunRaysInner = new SunRays(0, 3, 40, { initial: 60,  beginAnimation: -150, andAnimation: 60 }, this);

        this.sunRaysOuter.drawRays();
        this.sunRaysInner.drawRays();
    }

    getPower(){
        return this.power;
    }

    shine(){
        this.sunRaysOuter.animateRays();
        this.sunRaysInner.animateRays();
    }

    onEventChanged(e){
        if(e.changeStarted){
            sky.setActiveBackground();
            this.color = this.params.colorActive;
        }else{
            sky.resetBackground();
            this.color = this.params.color;
        }
        this.changeColors();
    }

    changeColors(){
        this.body.style.backgroundColor = this.color;
        this.sunRaysOuter.changeRaysColor();
        this.sunRaysInner.changeRaysColor();
    }
}

export const sun = new Sun();
