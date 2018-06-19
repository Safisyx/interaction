const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const sendAlarm = (vtimeout, client) => {
  let timeout //real timeout
  const date = new Date()
  const day = date.getDay()
  if (day === 0) timeout =2*vtimeout
  if (day === 6) timeout =vtimeout*(4/3)
  if (day >0 && day <6) timeout=vtimeout
  setTimeout(()=>{
    client.emit('ring',vDaysLeft())
    sendAlarm(vtimeout, client)
  }, 5000)
}

io.on('connection',(client)=> {
  console.log('A user is connected');

  client.on('alarm', data => {
    sendAlarm(data, client)
  })
  client.on('disconnect', ()=> {
    console.log('A user got disconnected');
  })
});


const sundaysLeft = (days) => {
  const rest = days%7
  const k = Math.floor((days-rest)/7)
  if (rest===0 || rest===1) return k
  if (rest>=2 && rest<=6) return k+1
}
const saturdaysLeft = (days) => {
  const rest = days%7
  const k = Math.floor((days-rest)/7)
  if (rest>=0 && rest<=2) return k
  if (rest>2 || rest<=6) return k+1
}

const otherDays = (days) => {
  return days-saturdaysLeft(days)-sundaysLeft(days)
}
const vDaysLeft = () => {
  const date = new Date()
  const h =  date.getHours()
  const mn = date.getMinutes()
  const endOfYear= new Date('12-31-2018')
  const timeLeft = Math.abs(endOfYear.getTime()-date.getTime())
  const daysLeft = Math.floor(timeLeft/(1000*3600*24))
  const timeLeftToday = 1440-(h*60+mn)

  const rest = daysLeft%7
  const k = Math.floor((daysLeft-rest)/7)

  let vdays
  const vleft = sundaysLeft(daysLeft)*0.5 + saturdaysLeft(daysLeft)*0.75 + otherDays(daysLeft)
  if (rest===1) {
    vdays = vleft +(timeLeftToday*0.5/1440)  //sunday
  }
  else if (rest===2) {
    vdays = vleft +(timeLeftToday*0.75/1440)  //saturday
  }
  else {
    vdays = vleft +(timeLeftToday/1440)  //another day
  }

  return vdays
}

app.get('/days-left', (request, response) => {
  console.log(vDaysLeft())
  response.send({vdays:vDaysLeft()})
})

server.listen(4001, () => console.log('Express API listening on port 4001'))
