const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.Server(app);
// const Observable = require('rxjs/Observable').Observable;
// require('rxjs/add/observable/fromEvent');
const wind = require("./classes/Wind");
const sun = require("./classes/Sun");

app.use(express.static(path.resolve('dist.client')));

app.get('*', function(req, res){
    res.sendFile(path.resolve('dist.client/index.html'));
});

let io = require('socket.io')(server);
wind.getEventStream().subscribe(sendEvent);
sun.getEventStream().subscribe(sendEvent);
wind.getEventChangeStream().subscribe(sendChangeEvent);
sun.getEventChangeStream().subscribe(sendChangeEvent);

let activeSockets = [], connected = false;
io.on('connection', function(socket){
    activeSockets.push(socket);
    console.log('a user connected');

    socket.on('disconnect', function(socket){
        console.log('user disconnected');
        activeSockets.splice(activeSockets.indexOf(socket), 1);
        connected = false;
    });

    if(activeSockets.length === 1){
        connected = true;
    }
});

function sendEvent(event) {
    if(connected){
        io.emit(event.name, { powerKoef: event.powerKoef, active: event.active });
    }
}

function sendChangeEvent(event) {
    if(connected){
        io.emit(event.name, { changeStarted: event.changeStarted });
    }
}

server.listen(3000, () => console.log('Example app listening on port 3000!'));
