Game.WaitingRoom = function (game) {
	this.debug = false;
};

Game.WaitingRoom.prototype = {
	create : function () {
		console.log("WaitingRoom.create");

        var position = 0,
            that = this;

		socket.on("list players", function(data){
			console.log("refresh list of players in the game");
            // if hoster : button start if more at least 2 players
		});

        // else : leave waiting room
        // if hoster leave room, everybody leave room

        this.drawButton("Leave Game", "1", position++, function(){
            socket.emit('leave game', {});
            that.state.start('LevelSingle');
        });

        socket.emit('get playerlist', {});
	},

	update : function () {

	},

	render: function () {
		if (this.debug) {

		}
	},
	
    drawButton : function(btnTitle, btnId, btnPosition, callBack){
        var button = game.add.graphics(100, 100);
        return this.drawButtonWithText(button, 50, 100+70*btnPosition, 100, 50, 7, {bSize: 2, bColor: 0x0000FF, bAlpha: 1, fColor: 0x027a71, fAlpha: 1}, btnTitle, {font: '25px Arial', fill: '#ffffff'}, btnId, callBack);
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

    drawText : function (x, y, width, height,text, textStyle) {
        var text = game.add.text(x + width / 2, y + height / 2, text, textStyle);
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
