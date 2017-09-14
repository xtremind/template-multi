var express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io").listen(http);


	var Game = require("./entities/game");

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

		client.on("get gamelist", onGameList);
		client.on("host game", onHostGame);
		client.on("join game", onJoinGame);
		
		client.on("start game on server", onStartGame);
	});
}

function onClientDisconnect () {
    console.log("onClientDisconnect");
	console.log("\tPlayer disconnected: "+this.id);
	
    //find the game by his id
	var removeGame = gameById(this.id);
	
	//if no game find
	if (!removeGame) {
		console.log("Game not found: "+this.id);
		return;
	}
	
	//remove the hosted game from the list of games
	gameList.splice(gameList.indexOf(removeGame), 1);
	
	//force refresh gamelist to others
	this.broadcast.emit("list games", gameList.filter(checkWaitingGame).slice(0,6));
}

var gameById = function (id) {
    for (var i = 0; i < gameList.length; i++) {
        if (gameList[i].id == id)
            return gameList[i];
    }
    return false;
}

function onGameList() {
	console.log("onGameList");
	this.emit("list games", gameList.filter(checkWaitingGame).slice(0,6));
}

function checkWaitingGame(game){
	return game.status == "WAITING";
}

function onHostGame() {
	console.log("onHostGame");
	//max 5 hosted games 
	if(!gameAlreadyHostBy(this.id)){
		console.log("host new game : " + this.id);
		var game = new Game(this.id);
		gameList.push(game);
		this.emit("game joined", game);
		this.broadcast.emit("list games", gameList);
	} else {
		console.log("game already host : " + this.id);
	}
}

function onJoinGame(data) {
	console.log("onJoinGame : " + data.id);
	
    //find the game by his id
	var game = gameById(data.id);

	//if no game find
	if(!game){
		console.log("Game not found: "+data.id);
		return;
	}

	this.emit("game joined", game);
}

function gameAlreadyHostBy(id){
	for (var i = 0; i < gameList.length; i++) {
		if(gameList[i].id === id){
			return true;
		}
	}
	return false;
}

function onStartGame() {
    console.log("onStartGame");
}

function broadcastingLoop() {
    //console.log("broadcastingLoop");
}

