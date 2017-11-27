const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/fromEvent');

module.exports = function (server) {
    let io = require('socket.io')(server);

    let activeSockets = [];
    io.on('connection', function(socket){
        activeSockets.push(socket);
        console.log('a user connected');
        socket.on('disconnect', function(socket){
            console.log('user disconnected');
            activeSockets.splice(activeSockets.indexOf(socket), 1);
            console.log("activeSockets", activeSockets.length);

        });

        Observable.fromEvent(socket, 'action').subscribe(function(value){
            console.log(value);
        });

        // socket.on('action', function(value){
        //     console.log(value);
        // });

        io.emit('server event', { e: "Event for everyone" });

        activeSockets[activeSockets.length - 1].broadcast.emit("broadcast", { e: "not for the last" });
        console.log("activeSockets", activeSockets.length);
    });
};