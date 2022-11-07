'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const PORT = process.env.PORT || 3002;
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log(`user with id: ${socket.id} connected`);

    socket.on('join-room', (roomID) => {
        socket.join(roomID);
        console.log(`user with id: ${socket.id} joined room : ${roomID} `)
    });

    socket.on('send-message', (data) => {
        // console.log(data);
        socket.to(data.room).emit('receive-message', data)
    });

    socket.on('disconnect', () => {
        console.log(`user with id: ${socket.id} disconnected`);
    });

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ^_^`);
    }
);