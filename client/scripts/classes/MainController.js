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
        this.onConnectGameListener = this.onConnectGame.bind(this);
        this.onReceivePlayerIdListener = this.onReceivePlayerId.bind(this);
        this.onSynchronizeGameListener = this.onSynchronizeGame.bind(this);
        this.onEndGameListener = this.onEndGame.bind(this);
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
        socket.on("connect-game", this.onConnectGameListener);
        socket.on("send-player-id", this.onReceivePlayerIdListener);
        socket.on("synchronize-game", this.onSynchronizeGameListener);
        socket.on("end-game", this.onEndGameListener);
        socket.on('disconnect', function(socket){
            socket.removeListener("connect-game", this.onConnectGameListener);
            socket.removeListener("send-player-id", this.onReceivePlayerIdListener);
            socket.removeListener("synchronize-game", this.onSynchronizeGameListener);
            socket.removeListener("end-game", this.onEndGameListener);
        });
    }

    onConnectGame (config){
        this.toTextMode();
        this.textField.innerText = "Synchronizing game...";
        this.gameRoom.onGameConnected(config);
    }

    onReceivePlayerId(id){
        this.gameRoom.setPlayerId(id);
    }

    onSynchronizeGame (){
        if(this.creatingGame){
            this.creatingGame = false;
            this.gameRoom.getSyncStream().next(true);
        }
        this.textField.innerText = "Synchronized";
        this.close();
    }

    onEndGame (){
        this.creatingGame = false;
        if(this.gameRoomObservableSubscription){
            this.gameRoomObservableSubscription.unsubscribe();
        }
        this.gameRoom.destroy();
        this.toBtnMode();
        this.open();
    }

    close(){
        this.overlay.style.top = -screenHeight + "px";
    }

    open(){
        this.overlay.style.top = 0;
    }

}

export const mainController = new MainController();
