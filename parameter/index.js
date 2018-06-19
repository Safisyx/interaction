var server = require('http').createServer();
var io = require('socket.io')(server);
var p=0;
const sleepTime = () => {
  const date = new Date()
  const r = Math.random()*0.02
  console.log(r);
  const day = date.getDay()
  let sleepFor
  if (day===0)
    sleepFor = r*2*24*3600*1000
  if (day===6)
    sleepFor = r*(4/3)*24*3600*1000
  if (day>0 && day<6)
    sleepFor = r*24*3600*1000
  return sleepFor
}

const parameter = () =>
{
  s= Math.random()
  p = p+s
  setTimeout( ()=>{
    io.emit('parameter',p)
    parameter()
  },sleepTime())
}

io.on('connection', function(client){
  console.log('A user connected');

  client.on('disconnect', ()=>
  console.log('A user has disconnected'));
});
server.listen(3000,()=>{
  parameter()
});
