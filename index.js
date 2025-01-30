const express = require("express");
const dotenv = require("dotenv");
const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Express server listening on port ${process.env.PORT || 5000}`);
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);


app.get("/", async (req, res) => {
	res.send('index.html');
})

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});