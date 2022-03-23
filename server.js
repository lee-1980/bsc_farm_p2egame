const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const {userController, preloadUsers} = require('./controllers/user.controller');
const {profileController, preloadProfile} = require('./controllers/profile.controller');
// Import the 'path' module (packaged with Node.js)
const path = require('path');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));

const server = http.createServer(app);
const username = process.env.USERNAME;
const password = process.env.DBPASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.giohg.mongodb.net/farm`;

const WebSocket = require('ws').Server;
const ws = new WebSocket({port: 8080})

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Could not connect', err));


ws.on('connection', async (socket) => {
    socket.isAlive = true;
    socket.on('pong', () => {
        socket.isAlive = true;
    });

    socket.on('message', async (message) => {

        userController(ws, socket, message);
        profileController(ws, socket, message);
        /*** Firecamp testing --**/
        // preloadUsers(socket);
        // preloadProfile(socket);
        /** --end --**/

    });

    // preloadUsers(socket);
    // preloadProfile(socket);


    socket.on('close', () => {
        console.log("I lost a client");
    });
    console.log("One more cient conected");

});

setInterval(() => {
    ws.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping(null, false, true);
    });
}, 10000);

server.listen(Number(3000), () => {
    console.log(`Server started on port ${JSON.stringify({server})} `);
});

