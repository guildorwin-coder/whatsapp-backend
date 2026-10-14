const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('send_message', (data) => {
    const room = data.room || 'General Room';
    socket.to(room).emit('receive_message', data);
    console.log(`Message sent in room ${room}:`, data.text);
  });

  socket.on('offer', (data) => {
    const room = data.room || 'General Room';
    socket.to(room).emit('offer', data.offer);
  });

  socket.on('answer', (data) => {
    const room = data.room || 'General Room';
    socket.to(room).emit('answer', data.answer);
  });

  socket.on('candidate', (data) => {
    const room = data.room || 'General Room';
    socket.to(room).emit('candidate', data.candidate);
  });

  socket.on('end_call', (data) => {
    const room = data.room || 'General Room';
    socket.to(room).emit('end_call');
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});