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
        this.listenToGameSocket();
    }

    createGame(){
        this.creatingGame = true;
        this.toTextMode();
        this.gameRoomObservable = this.gameRoom.createGame();
        this.gameRoomObservableSubscription = this.gameRoomObservable.subscribe((state) => {
            this.textField.innerText = state;
        });
    }

    toTextMode(){
        this.createGameBtn.style.display = "none";
        this.textField.style.display = "inline-block";
    }

    toBtnMode(){
        this.createGameBtn.style.display = "inline-block";
        this.textField.style.display = "none";
    }

    listenToGameSocket(){
        socket.on("connect-game", (config) => {
            this.toTextMode();
            this.textField.innerText = "Synchronizing game...";
            this.gameRoom.onGameConnected(config);

        });
        socket.on("synchronize-game", () => {
            if(this.creatingGame){
                this.creatingGame = false;
                this.gameRoom.getSyncStream().next(true);
            }
            this.textField.innerText = "Synchronized";
            this.close();
        });

        socket.on("end-game", () => {
            this.creatingGame = false;
            if(this.gameRoomObservableSubscription){
                this.gameRoomObservableSubscription.unsubscribe();
            }
            this.gameRoom.destroy();
            this.toBtnMode();
            this.open();
        });
    }

    close(){
        this.overlay.style.top = -screenHeight + "px";
    }

    open(){
        this.overlay.style.top = 0;
    }

}

export const mainController = new MainController();
