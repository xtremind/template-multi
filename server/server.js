var express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io").listen(http);

// Broadcasting loop works better than sending an update every time a player moves because waiting for player movement messages adds
// another source of jitter.
var updateInterval = 100; // Broadcast updates every 100 ms.

// Serve up index.html.
app.use(express.static("client"));
http.listen(process.env.PORT || 8000);

//redirect client part
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

init();

function init() {
	console.log("Starting Server");
	
	// Begin listening for events.
	setEventHandlers();

	// Start game loop
    setInterval(broadcastingLoop, updateInterval);
    
    console.log("Server Initialized");
}

function setEventHandlers () {
	io.on("connection", function(client) {
		console.log("New player has connected: " + client.id);

		client.on("disconnect", onClientDisconnect);
		client.on("start game on server", onStartGame);
		client.on("ready for round", onReadyForRound);

		client.on("get gamelist", onGameList);
		client.on("host game", onHostGame);
	});
}

function onClientDisconnect() {
    console.log("onClientDisconnect");

}

function onGameList() {
	console.log("onGameList");
	
	this.emit("list games", [{gameid: 1}, {gameid: 2}]);

}

function onHostGame(data) {
	console.log("onHostGame");
	//max 5 hosted games 

	this.emit("new game", {gameid: 1});
	this.broadcast.emit("new game", {gameid: 1});
	
}

function onStartGame() {
    console.log("onStartGame");

}

function onReadyForRound() {
    console.log("onReadyForRound");

}

function broadcastingLoop() {
    //console.log("broadcastingLoop");

}

