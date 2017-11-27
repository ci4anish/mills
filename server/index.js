// import express from 'express';
// import http from 'http';
// import path from 'path';
const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.Server(app);

app.use(express.static(path.resolve('dist.client')));

app.get('*', function(req, res){
    res.sendFile(path.resolve('dist.client/index.html'));
});

require("./socketio")(server);

server.listen(3000, () => console.log('Example app listening on port 3000!'));
