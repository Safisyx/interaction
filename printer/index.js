const socket = require('socket.io-client')('http://localhost:3000');
const request = require('superagent')
socket.on('connect', ()=>console.log('A user connected'))

socket.on('parameter', (data)=>{

  request
    .get('http://localhost:4001/days-left')
    .then (result => console.log(`p=${data}, .... virtual days left=${result.body.vdays}`))
})
