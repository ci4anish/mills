import { GameRoom } from "./GameRoom";
import { Overlay } from "./Overlay";
import { socket } from '../socket';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/multicast';

export class MainController {

    constructor(){
        this.gameRoom = new GameRoom(this);
        this.onConnectGameListener = this.onConnectGame.bind(this);
        this.onReceivePlayerIdListener = this.onReceivePlayerId.bind(this);
        this.onSynchronizeGameListener = this.onSynchronizeGame.bind(this);
        this.onAddMillListener = this.onAddMill.bind(this);
        this.onEndGameListener = this.onEndGame.bind(this);
        this.allMillsDestroyStream = new Subject();
    }

    setup(){
        this.overlay = new Overlay();
        this.overlay.getBtnClickStream().subscribe(this.createGame.bind(this));
        this.listenToGameSocket();
    }

    createGame(){
        this.creatingGame = true;
        this.overlay.toTextMode();
        this.gameRoomObservable = this.gameRoom.createGame();
        this.gameRoomObservableSubscription = this.gameRoomObservable.subscribe((state) => {
            this.overlay.setTextField(state);
        });
    }

    listenToGameSocket(){
        socket.on("connect-game", this.onConnectGameListener);
        socket.on("send-player-id", this.onReceivePlayerIdListener);
        socket.on("synchronize-game", this.onSynchronizeGameListener);
        socket.on("add-mill", this.onAddMillListener);
        this.millEnergyGatheredStream = Observable.fromEvent(socket, "mill-energy-gathered").multicast(new ReplaySubject(1)).refCount();
        socket.on("end-game", this.onEndGameListener);
        // socket.on('disconnect', function(socket){
        //     socket.removeListener("connect-game", this.onConnectGameListener);
        //     socket.removeListener("send-player-id", this.onReceivePlayerIdListener);
        //     socket.removeListener("synchronize-game", this.onSynchronizeGameListener);
        //     socket.removeListener("end-game", this.onEndGameListener);
        // });
    }

    getAllMillsDestroyStream(){
        return this.allMillsDestroyStream;
    }

    getMillEnergyGatheredStream(){
        return this.millEnergyGatheredStream;
    }

    onConnectGame (config){
        this.overlay.toTextMode();
        this.overlay.setTextField("Synchronizing game...");
        this.gameRoom.onGameConnected(config);
    }

    onReceivePlayerId(id){
        this.gameRoom.setPlayerId(id);
    }

    onSynchronizeGame (players){
        if(this.creatingGame){
            this.creatingGame = false;
            this.gameRoom.getSyncStream().next(true);
        }
        this.gameRoom.setUpPlayers(players);
        this.overlay.setTextField("Synchronized");
        this.overlay.close();
    }

    onAddMill(millConfig){
        this.gameRoom.onAddMill(millConfig);
    }

    onEndGame (){
        this.creatingGame = false;
        if(this.gameRoomObservableSubscription){
            this.gameRoomObservableSubscription.unsubscribe();
        }
        this.allMillsDestroyStream.next();
        this.gameRoom.destroy();
        this.overlay.toBtnMode();
        this.overlay.open();
    }

    emitEvent(name, event){
        socket.emit(name, event);
    }

}

export const mainController = new MainController();
