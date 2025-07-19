
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', socket => {
  socket.on('send-changes', delta => {
    socket.broadcast.emit('receive-changes', delta);
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
