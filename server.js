const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Error 404' });
});

const io = socket(server);
io.on('connection', (socket) => {
  console.log('Hi, new connection with id:', socket.id);
  io.to(socket.id).emit('updataData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => socket.broadcast.emit('removeTask', id));
});
