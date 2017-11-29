const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.Server(app);
const GameRoom = require('./classes/GameRoom');
const ReplaySubject = require('rxjs/ReplaySubject').ReplaySubject;
require('rxjs/add/operator/map');
require('rxjs/add/operator/filter');

app.use(express.static(path.resolve('dist.client')));

app.get('*', function(req, res){
    res.sendFile(path.resolve('dist.client/index.html'));
});

const io = require('socket.io')(server);

let activeSockets = [], gameRoom, activeSocketsStream = new ReplaySubject(1), activeSocketsSubscription;

io.on('connection', function(socket){
    activeSockets.push(socket);
    activeSocketsStream.next(activeSockets);
    console.log('a user connected');

    socket.on('disconnect', function(socket){
        console.log('user disconnected');
        activeSockets.splice(activeSockets.indexOf(socket), 1);
        activeSocketsStream.next(activeSockets);
        if(gameRoom){
            gameRoom.destroy();
            gameRoom = undefined;
            activeSocketsSubscription.unsubscribe();
        }
    });

    socket.on("create-game", (config) => {
        console.log('create game event');
        gameRoom = new GameRoom(config, socket);
        if(activeSockets.length === 2){
            activeSocketsStream.next(activeSockets);
        }
        activeSocketsSubscription = activeSocketsStream
            .filter((sockets => sockets.length === 2))
            .map((sockets => sockets.find(s => s !== socket)))
            .subscribe(listenerSocket => gameRoom.setup(listenerSocket));
    });
});

server.listen(3000, () => console.log('Example app listening on port 3000!'));
