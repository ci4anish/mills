import { mainContainer, screenHeight } from "../constants";
import { GameRoom } from "./GameRoom";
import { socket } from '../socket';

export class MainController {

    constructor(){
        this.gameRoom = new GameRoom();
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

    setup(){
        this.draw();
        this.createGameBtn.addEventListener("click", this.createGame.bind(this));
        this.listenToGameConnection();
    }

    createGame(){
        this.createGameBtn.style.display = "none";
        this.textField.style.display = "inline-block";
        this.gameRoomObservable = this.gameRoom.createGame();
        this.gameRoomObservable.subscribe((state) => {
            this.textField.innerText = state;
        });
    }

    listenToGameConnection(){
        socket.on("connect-game", (config) => this.gameRoom.getGameConnectionStream().next(config));
    }

    close(){
        this.overlay.style.top = -screenHeight;
    }

}

export const mainController = new MainController();
