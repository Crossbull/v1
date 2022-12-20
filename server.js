const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

const players = []
const grids = []

wss.getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
}

wss.on('connection', function connection(ws) {
  ws.id = wss.getUniqueID();
  players.push(ws.id);

  ws.on('message', function incoming(data) {
    if(grids.length < 2){
      grids.push(data);
    }
    if(ws.id === players[0]){
      //player1
      if(grids[1].includes(data)){
        players[0].send(1);
        console.log(`Player1 Hit`);
      }else{
        wss.client.send(0);
        console.log(`Player1 Miss`);
      }
    }else if(ws.id === players[1]){
      //player2
      if(grids[0].includes(data)){
        players[1].send(1);
        console.log(`Player2 Hit`);
      }else{
        players[1].send(0);
        console.log(`Player2 Miss`);
      }
    }
  })
})

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`);
})
