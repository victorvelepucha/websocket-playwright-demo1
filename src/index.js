
const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (e) {
      return;
    }
    const text = `[${msg.username}]: ${msg.message}`;
    // Broadcast to all clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
});