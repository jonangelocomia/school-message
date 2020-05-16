const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const app = express();

const PORT = process.env.PORT || 2802;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/build/'));
app.use(express.static(__dirname + '/assets/'));

app.set('view engine', 'html');

/** app.route('/api/history')
  .get(function(req, res) {
    res.json({ flag: "success", history: loadHistory() })
  }); **/

app.route('/***')
    .get(function(req, res) {
      res.sendFile(path.resolve(__dirname, '', 'build', 'index.html'));
    });

const editHistory = (room, moderator, messages, name, message) => {
  const date = new Date();
  const history = loadHistory()
  const duplicateHistory = history.find((shistory) => shistory.room === room)

  if (!duplicateHistory) {
    history.push({
      id: shortid.generate(),
      date,
      room,
      moderator,
      messages
    })
    saveHistory(history)
  } else {
    let historyPlaceholder = [...history];
    history[historyPlaceholder.findIndex(x => x.room == room)].messages.push({
      date,
      name,
      message
    })
    saveHistory(history)
  }
}

const saveHistory = (history) => {
    const dataJSON = JSON.stringify(history)
    fs.writeFileSync('history.json', dataJSON)
}

const loadHistory = () => {
    try {
        const dataBuffer = fs.readFileSync('history.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  socket.on('CHAT_MESSAGE', data => {
    io.emit('CHAT_MESSAGE', data);
    editHistory(data.room, '', [], data.name, data.message)
    io.emit('LOAD_DATA', { flag: "success", history: loadHistory() });
  });
  socket.on('JOIN_MESSAGE', data => {
    io.emit('JOIN_MESSAGE', data);
  });
  socket.on('CONVO_CREATED', data => {
    editHistory(data.room, data.name, [], '', [])
    io.emit('LOAD_DATA', { flag: "success", history: loadHistory() });
  });
  socket.on('LOAD_DATA', () => {
    io.emit('LOAD_DATA', { flag: "success", history: loadHistory() });
  });
  // socket.on('disconnect', () => console.log("Client disconnected"));
});

server.listen(PORT, () => { console.log( `express server started at -> http://localhost:${PORT}/` ); });
