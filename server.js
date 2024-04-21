const express = require('express');
const session = require('express-session');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'key', // Change this to a secure secret
  resave: false,
  saveUninitialized: false,
  store: new session.MemoryStore(), // Use MemoryStore for session storage
  cookie: { secure: false } // Adjust cookie settings as needed
}));


const server = http.createServer(app);
const io = new Server(server);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/pubic/index.html');
});
app.post('/',(req,res)=>{
  req.session.username = req.body.username;
  res.json({ success: true,username:req.username});
});
app.get('/redirectChatRoom',(req,res)=>{
  if (req.session.username) {
    res.redirect(`/chatRoom?username=${req.session.username}`);
} else {
  console.log("not work");
    // Redirect to login page if not logged in
    res.redirect('/');
}
})
app.get('/chatRoom',(req,res)=>{
  res.sendFile(__dirname+'/pubic/chatRoom.html');

});

io.on('connection', (socket) => {
  socket.on('message',(data) =>{
    io.emit('message',data.name+' : '+data.text);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
});

server.listen(3000, () => {
  console.log('listening on *:'+3000);
});