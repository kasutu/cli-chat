const WebSocket = require('ws');
const readline = require('readline');
const ws = new WebSocket('ws://localhost:3000');

let nickname = '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your nickname: ', (answer) => {
  nickname = answer.trim();
  ws.send(`/nick ${nickname}`);
  mainLoop();
});

function mainLoop() {
  ws.on('open', () => {
    console.log(`Connected to the server as ${nickname}`);
  });

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  ws.on('error', (error) => {
    console.error('Error occurred:', error);
  });

  rl.question('', (input) => {
    if (input.trim() === '/nick') {
      rl.question('Enter new nickname: ', (newNickname) => {
        nickname = newNickname.trim();
        ws.send(`/nick ${nickname}`);
      });
    } else if (input.trim() !== '') {
      ws.send(`${nickname}: ${input}`);
    }
    mainLoop();
  });
}

