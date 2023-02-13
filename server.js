const express = require("expres");

const app = express();

const http = require("http").Server(app);

const io = require("socket.io")(http);

io.on("connection", () =>{
    console.log("a user is connected")
   })

const server = app.listen(3000, () => {
    console.log("server is running on port", server.address().port);
});

const mongoose = require("mongoose");


mongoose.connect(dbUrl , (err) => { 
    console.log("mongodb connected",err);
});


const Message = mongoose.model("Message",{ name : String, message : String})

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname));

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      res.sendStatus(200);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message', req.body);
      res.sendStatus(200);
    })
  })
