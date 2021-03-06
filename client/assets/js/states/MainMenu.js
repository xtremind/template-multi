Game.MainMenu = function (game) {
    this.gameList = [];
};

Game.MainMenu.prototype = {
    create : function () {       
		console.log("MainMenu.create");
        position = 0,
            that = this;

        //Add Library
        game.add.plugin(PhaserInput.Plugin);

        // add a background image

        // add a title
        graphics.drawText(game, {x:this.world.centerX, y:80, height:0, width: 0}, 'Template Game', styles.titleText);

        //add input text for naming player
        if (typeof game.playerName === 'undefined') {
            game.playerName="Player_" + socket.id.substring(0,6);
        }

        var playerName = graphics.drawInputText(game, {x: 10, y:90}, game.playerName, styles.playerNameInput);

        //add rounded buttons
        graphics.drawButtonWithText(game, {x:50, y:100, height:50, width:200}, styles.hostButton, 'host game', styles.hostText, 'host game', function(){game.playerName=playerName.value;socket.emit('host game', {name: playerName.value});});

		socket.on("list games", function(data){
            // delete current join List            
            for(var key in that.gameList){
                graphics.deleteButton(that.gameList[key]);
            }

            that.gameList = [];
            var position = 0;

            // create new join List
            data.forEach(function(party){
                that.gameList[party.id] = graphics.drawButtonWithText(game, {x:50, y:100+70*++position, height:50, width: 200}, styles.joinButton, 'join game', styles.joinText, 'join game', function(){
                    game.playerName=playerName.value;
                    console.log("join game " + party.id); 
                    socket.emit('join game', {id: party.id, name: playerName.value});
                });
            });
        });

        socket.on("game joined", function(party){
            that.gameJoined(party.id);
        });

        socket.emit('get gamelist', {});
    },

    gameJoined : function(id){
        console.log("game joined " + id);
        socket.off("list games");
        socket.off("game joined");
        game.currentGameId = id;
        that.gameList = [];
        that.state.start('WaitingRoom');
    },

    start : function () {}
};
