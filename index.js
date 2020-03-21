const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const app = express();

const PORT = process.env.PORT || 2802;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/build/'));
app.use(express.static(__dirname + '/assets/'));

app.set('view engine', 'html');

app.route('/***')
    .get(function(req, res) {
      res.sendFile(path.resolve(__dirname, '', 'build', 'index.html'));
    });

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  socket.on('CHAT_MESSAGE', data => {
    io.emit('CHAT_MESSAGE', data);
  });
  socket.on('JOIN_MESSAGE', data => {
    io.emit('JOIN_MESSAGE', data);
  });
  socket.on('CONVO_CREATED', data => {
    io.emit('CONVO_CREATED', data);
  });
  socket.on('disconnect', () => console.log("Client disconnected"));
});

server.listen(PORT, () => { console.log( `express server started at -> http://localhost:${PORT}/` ); });
