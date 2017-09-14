Game.WaitingRoom = function (game) {
    this.playersList = [];
};

Game.WaitingRoom.prototype = {
	create : function () {
		console.log("WaitingRoom.create");

        position = 0;
        that = this;
        startButton = null;


        // add a title
        var title = this.add.text(this.world.centerX, 80, 'Template Game', {font: '50px Arial', fill: '#ffffff'});
        title.anchor.setTo(0.5, 0.5);

        // add a subtitle
        var subtitle = this.add.text(this.world.centerX, 120, 'Game ' + game.currentGameId, {font: '30px Arial', fill: '#ffffff'});
        subtitle.anchor.setTo(0.5, 0.5);

		socket.on("list players", function(data){
			console.log("refresh list of players in the game");
            // delete current List            
            for(var key in that.playersList){
                that.deleteText(that.playersList[key]);
            }
        
            that.playersList = [];
            position = 0;

            if(startButton != null){
                that.deleteButton(startButton);
                startButton = null;
            }
            // create new join List
            data.forEach(function(player){
                that.playersList[player] = that.drawText(that.world.centerX, 100+70*position++, 100, 50, player, {font: '25px Arial', fill: '#ffffff'}); 
            });
            
            // if hoster : button start if more at least 2 players
            if(game.currentGameId === this.id && data.length > 1){
                startButton =that.drawButton("Start Game", "1", position++, function(){
                    socket.emit('start game', {id: game.currentGameId});
                    that.state.start('Party');
                });
            }
		});

		socket.on("end game", function(data){
            socket.off("list players");
            socket.off("end game");
            game.currentGameId = null;
            that.state.start('MainMenu');
        });

        // else : leave waiting room
        // if hoster leave room, everybody leave room

        this.drawButton("Leave Game", "1", position++, function(){
            socket.emit('leave game', {id: game.currentGameId});
            socket.off("list players");
            socket.off("end game");
            game.currentGameId = null;
            that.state.start('MainMenu');
        });

        socket.emit('get playerlist', {id: game.currentGameId});
	},

	update : function () {

	},
	
    drawButton : function(btnTitle, btnId, btnPosition, callBack){
        var button = game.add.graphics(100, 100);
        return this.drawButtonWithText(button, 50, 100+70*btnPosition, 100, 50, 7, {bSize: 2, bColor: 0x0000FF, bAlpha: 1, fColor: 0x027a71, fAlpha: 1}, btnTitle, {font: '25px Arial', fill: '#ffffff'}, btnId, callBack);
    },

    deleteText : function(text){
        text.destroy();
    },

    deleteButton : function(button) {
        button.children[0].destroy();
        button.clear();
    },

    start : function () {
        
    },

    drawRoundedRect : function (graphics, x, y, width, height, radius, btnStyle) {
        graphics.beginFill(btnStyle.fColor, btnStyle.fAlpha);
        graphics.lineStyle(btnStyle.bSize, btnStyle.bColor, btnStyle.bAlpha);
        graphics.drawRoundedRect(x, y, width, height, radius);
        graphics.endFill();
        return graphics;
    },

    drawText : function (x, y, width, height, label, labelStyle) {
        var text = game.add.text(x + width / 2, y + height / 2, label, labelStyle);
        text.smoothed = true;
        text.anchor.x = 0.5;
        text.anchor.y = 0.4;
        return text;
    },

    addInputDownToRect : function(graphics, callback){
        graphics.inputEnabled = true;
        graphics.input.useHandCursor = true;
        graphics.events.onInputDown.add(callback, this);
        return graphics;
    },

    drawButtonWithText: function (graphics, x, y, width, height, radius, btnStyle, text, textStyle, btnName, callback) {
        
        graphics.clear();  
        graphics.name = btnName;

        var buttonRect = this.drawRoundedRect(graphics, x, y, width, height, radius, btnStyle);
        var buttonText = this.drawText(x, y, width, height,text, textStyle);
        buttonRect.addChild(buttonText);

        return this.addInputDownToRect(buttonRect, callback);
    }
};
