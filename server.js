const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('New client connected');

  ws.on('message', (message) => {
    const command = message.toString().split(' ')[0];

    switch(command) {
      case '/nick':
        broadcast(`Client changed nickname to ${message.split(' ')[1]}`, ws);
        break;
      case '/ping':
        ws.send('/pong');
        break;
      default:
        broadcast(message, ws);
    }
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected');
  });
});

function broadcast(message, senderWs) {
  clients.forEach(client => {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

