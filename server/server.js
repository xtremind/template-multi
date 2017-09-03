var express = require("express"),
    app = express(),
    server = require("http").Server(app),
    io = require("socket.io").listen(server);

var Lobby = require("./assets/lobby");

// Broadcasting loop works better than sending an update every time a player moves because waiting for player movement messages adds
// another source of jitter.
var updateInterval = 100; // Broadcast updates every 100 ms.

// Serve up index.html.
app.use(express.static("client"));
server.listen(process.env.PORT || 8000);

init();

function init() {
    //Lobby.initiate();
    
	// Begin listening for events.
	setEventHandlers();

	// Start game loop
    setInterval(broadcastingLoop, updateInterval);
    
    console.log("Server Initialized");
};

function setEventHandlers () {
	io.on("connection", function(client) {
		console.log("New player has connected: " + client.id);

		client.on("disconnect", onClientDisconnect);
		client.on("start game on server", onStartGame);
		client.on("ready for round", onReadyForRound);

		client.on("enter lobby", Lobby.onEnterLobby);
		client.on("host game", Lobby.onHostGame);
		client.on("enter pending game", Lobby.onEnterPendingGame);
		client.on("leave pending game", Lobby.onLeavePendingGame);
	});
};

function onClientDisconnect() {

}

function onStartGame() {

}

function onReadyForRound() {

}

function broadcastingLoop() {

}

