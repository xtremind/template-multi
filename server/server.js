var express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io").listen(http);

// Broadcasting loop works better than sending an update every time a player moves because waiting for player movement messages adds
// another source of jitter.
var updateInterval = 100; // Broadcast updates every 100 ms.

var gameList = [];

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
		client.on("join game", onJoinGame);
	});
}

function onClientDisconnect() {
    console.log("onClientDisconnect");

}

function onGameList() {
	console.log("onGameList");
	this.emit("list games", gameList);
}

function onHostGame() {
	console.log("onHostGame");
	//max 5 hosted games 
	if(gameList.length < 6 && !gameAlreadyHostBy(this.id)){
		console.log("host new game : " + this.id);
		var game = {gameid: this.id};
		gameList.push(game);
		this.emit("new game", game);
		this.broadcast.emit("new game", game);
	} else {
		console.log("game already host : " + this.id);
	}
}

function onJoinGame(data) {
	console.log("onJoinGame : " + data.id);
}

function gameAlreadyHostBy(id){
	for (var i = 0; i < gameList.length; i++) {
		if(gameList[i].gameid === id){
			return true;
		}
	}
	return false;
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

