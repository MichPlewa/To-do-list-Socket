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

io = socket(server);
io.on('connection', (socket) => {
  console.log('Hi, new connection with id:', socket.id);

  io.to(socket.id).emit('updateData', tasks);

  io.on('addTask', (task) => {
    tasks.push(task);
    io.boadcast.emit('addTask', tasks);
  });

  io.on('removeTask', (id) => {
    tasks.filter((item) => {
      item.id !== id;
    });

    io.boadcast.emit('removeTask', tasks);
  });
});
