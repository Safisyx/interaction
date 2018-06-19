const socket = require('socket.io-client')('http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
});
const timeSocket = require('socket.io-client')('http://localhost:4001', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
});
const request = require('superagent')
const fs = require('fs');
var p=0
socket.on('connect', ()=>console.log('A user connected'))
socket.on('parameter', (data)=>{
  p=data
  request
    .get('http://localhost:4001/days-left')
    .then (result => {
      console.log(`p=${data}, .... virtual days left=${result.body.vdays}`)
      fs.appendFile('log.txt', `p=${data}, .... virtual days left=${result.body.vdays}\n`, err=>{
        if (err) console.log(err);
      })
    })
    .catch(err => {
      console.log(`Maybe the time server is down but p=${p}`)
      fs.appendFile('log.txt', `Maybe the time server is down but p=${p}\n`, err=>{
        if (err) console.log(err);
      })
    })
})

timeSocket.on('connect', ()=>{
  timeSocket.emit('alarm', 0.01)
})

timeSocket.on('ring', (data)=>{
  console.log(`p=${p}, .... virtual days left=${data}`)
  fs.appendFile('log.txt', `p=${p}, .... virtual days left=${data}\n`, err=>{
    if (err) console.log(err);
  })
})
