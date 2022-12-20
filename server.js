const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

const players = []
const grids = []
const turns = true

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
    if(ws.id === players[0] && turns === true){
      //1st number = player / 2nd number = hit/miss

      //player1
      if(grids[1].includes(data)){
        players[0].send('01');
        console.log('01')//player1 hit
      }else{
        wss.client.send('00');
        console.log('00')//player1 miss
      }
      turns = false
    }else if(ws.id === players[1] && turns === false){
      //player2
      if(grids[0].includes(data)){
        players[1].send('11');
        console.log('11')//player2 hit
      }else{
        players[1].send('10');
        console.log('10')//player2 miss
      }
      turns = true
    }else{
      players.send('2');
      console.log('2')//Not your turn
    }
  })
})

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`);
})
