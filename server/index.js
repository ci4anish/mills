const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.Server(app);
const GameRoom = require('./classes/GameRoom');

app.use(express.static(path.resolve('dist.client')));

app.get('*', function(req, res){
    res.sendFile(path.resolve('dist.client/index.html'));
});

const io = require('socket.io')(server);

let activeSockets = [], gameRoom;

io.on('connection', function(socket){
    activeSockets.push(socket);
    console.log('a user connected');

    socket.on('disconnect', function(socket){
        console.log('user disconnected');
        activeSockets.splice(activeSockets.indexOf(socket), 1);
        if(gameRoom){
            gameRoom.destroy();
            gameRoom = undefined;
        }
    });

    if(activeSockets.length === 2){
        gameRoom = new GameRoom(io, activeSockets);
        gameRoom.setup();
    }
});

server.listen(3000, () => console.log('Example app listening on port 3000!'));
